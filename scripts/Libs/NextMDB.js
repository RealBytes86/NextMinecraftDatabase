import { world } from "@minecraft/server";

const score_begin = -1000000000;

export class MinecraftDB {

    collection(collection) {
        return new collections(collection);
    }

    createCollection(collection) {
        const scoreboards = world.scoreboard.getObjectives();

        for(let i = 0; i < scoreboards.length; i++) {
            const scoreboard = scoreboards[i];
            if(scoreboard.displayName == collection) {
                return null;
            }
        }

        return world.scoreboard.addObjective(collection, collection);
    }

    deleteCollection(collection) {

        const scoreboards = world.scoreboard.getObjectives();

        for(let i = 0; i < scoreboards.length; i++) {
            const scoreboard = scoreboards[i];
            if(scoreboard.displayName == collection) {
                return world.scoreboard.removeObjective(collection);
            }
        }

        return null;
    }
}


class document {

    constructor(participant, scoreboard, JSON_) {
        this.participant = participant;
        this.scoreboard = scoreboard;
        this.JSON = JSON_;
    }

    delete() {
        world.getDimension("overworld").runCommand(`scoreboard players reset "${this.participant.displayName}" ${this.scoreboard.displayName}`)
        return 1;
    }

    output() {
        console.warn(JSON.stringify(this.JSON[0]));
        return 1;
    }

    update(query) {
        world.getDimension("overworld").runCommand(`scoreboard players reset "${this.participant.displayName}" ${this.scoreboard.displayName}`)
        world.getDimension("overworld").runCommand(`scoreboard players set "${escapeQuotes(JSON.stringify(query))}" ${this.scoreboard.displayName} 0`)
        return 1;
    }
}

class collections {

    constructor(collection) {
        this.collection = collection;
    }
    findOne(query) {
        const scoreboard = world.scoreboard.getObjective(this.collection);
        const participants = scoreboard.getParticipants();
        
        for(let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            const unscape = unescapeQuotes(participant.displayName)
            if(isJSONObject(unscape)) {
                const JSON_OBJECT = JSON.parse(unscape);
                if(find(JSON_OBJECT, query)) {
                    return {
                        json: JSON_OBJECT[0],
                        document: new document(participant, scoreboard, JSON_OBJECT)
                    }
                }
            }
        }

        return null;
    }

    deleteOne(query) {

        const participants = world.scoreboard.getObjective(this.collection).getParticipants();
        
        for(let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            const unscape = unescapeQuotes(participant.displayName)
            if(isJSONObject(unscape)) {
                const JSON_OBJECT = JSON.parse(unscape);
                if(find(JSON_OBJECT, query)) {
                   world.getDimension("overworld").runCommand(`scoreboard players reset "${participant.displayName}" ${this.collection}`)
                   return 1;
                }
            }
        }

        return null;
    }

    insertOne(json) {
        world.getDimension("overworld").runCommand(`scoreboard players set "${escapeQuotes(JSON.stringify(json))}" ${this.collection} 0`)
        return 1;
    }

}

function escapeQuotes(jsonString) {
    return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function unescapeQuotes(jsonString) {
    return jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function find(array, query) {
    for (let i = 0; i < array.length; i++) {
        const obj = array[i];
        if (isMatch(obj, query)) {
            return obj;
        }
    }
    return null;
}

function isMatch(obj, query) {
    for(const key in query) {
        if (query.hasOwnProperty(key)) {
            const queryValue = query[key];
            const objValue = obj[key];
            if (typeof queryValue === 'object') {
                if (Array.isArray(queryValue)) {
                    if (!isArrayMatch(objValue, queryValue)) {
                        return false;
                    }
                } else {
                    if (!isMatch(objValue, queryValue)) {
                        return false;
                    }
                }
            } else {
                if (objValue !== queryValue) {
                    return false;
                }
            }
        }
    }
    return true;
}

function isArrayMatch(objArray, queryArray) {
    if (!Array.isArray(objArray)) {
        return false;
    }
    for (let i = 0; i < queryArray.length; i++) {
        const queryObj = queryArray[i];
        let found = false;
        for (let j = 0; j < objArray.length; j++) {
            const obj = objArray[j];
            if (isMatch(obj, queryObj)) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

export function JParse(jsonString) {

    if(typeof jsonString  == "object") return { json: jsonString, isValid: true };
    
    try {
        const jsonParse = JSON.parse(jsonString);
        return { json: jsonParse, isValid: true };
    }catch {
        return { json: {}, isValid: false };
    }
}

export class XOR {
    /**
     * @param {string} ciphertext
     * @returns {string}
     */
    #key = "ABCDEFGHIJKLMNOP"

    decrypt(ciphertext) {
        return new XOREncryption(this.#key).Decrypt(ciphertext);
    }

    /**
     * @param {string} key 
     */
    setKey(key) {
        if(typeof key == "string") {
            if(key.length == 16) {
                this.#key = key
            } else {
                throw new Error("Invalid key. Only key length 16");
            }
        } else {
            throw new Error("Invalid string");
        }
    }

    /**
     * @returns {string}
     */
    getKey() {
        return this.#key
    }

    /**
     * @param {string} plaintext 
     * @returns 
     */
    encrypt(plaintext) {
        return new XOREncryption(this.#key).Encrypt(plaintext);
    }
}

class XOREncryption {
    constructor(key) {
        this.key = key;
    }

    Encrypt(plaintext) {
        if(this.key.length != 16) throw new Error("Der Schlüssel muss 16 Bytes lang sein.");
        const plaintextBytes = this.stringToBytes(plaintext)
        const keyBytes = this.stringToBytes(this.key);
        for(let j = 0; j < 16; j++) plaintextBytes[j] ^= keyBytes[j];
        return this.bytesToHexString(plaintextBytes);
    }

    Decrypt(ciphertext) {
        if(this.key.length !== 16) throw new Error("Der Schlüssel muss 16 Bytes lang sein.");
        const ciphertextBytes = this.hexStringToBytes(ciphertext);
        const keyBytes = this.stringToBytes(this.key);
        for(let j = 0; j < 16; j++) ciphertextBytes[j] ^= keyBytes[j]
        return this.bytesToString(ciphertextBytes);
    }

    hexStringToBytes(hexString) {
        const bytes = [];
        for(let i = 0; i < hexString.length; i += 2) bytes.push(parseInt(hexString.substr(i, 2), 16));
        return bytes;
    }
    
    bytesToHexString(bytes) {
        return bytes.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
    }
    
    stringToBytes(string) {
        const utf8 = encodeURIComponent(string);
        const bytes = [];
        for(let i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
        return bytes;
    }

    bytesToString(bytes) {
        return decodeURIComponent(String.fromCharCode.apply(null, bytes));
    }
}
