import { world, system } from "@minecraft/server";

const overworld = world.getDimension("minecraft:overworld");
let NMDBkey = "DATABASE:NEXTMDB";
let ready = false;

export class NextMDB {

    /**
     * @param {string} name 
     * @returns {Collection}
     */
    Collection(name) {
        if(typeof name == "string") {
            return new Collection(name)
        } else {
            throw new Error("Name is invalid")
        }
    }

    createCollection() { 

    }

    resetCollection() { 

    }

    deleteColection() {

    }

    getAllCollection() {
        return "Null";
    }

    sizeCollections() {

    }

    /**
     * @returns {XOR} 
     */
    XOR() {
        return new XOR()
    }

    /**
     * @param {boolean} boolean 
     */
    Initialization(boolean) {
        if(typeof boolean == "boolean" && boolean == true) {
            world.getAllPlayers().forEach((player) => {
                if(player.isOp()) {
                    world.sendMessage(`§7[§6NextMDB§7] §aInitialization was successful.`)
                }
            })
        }

        ready = true;
    }
}

class Collection {
    /**
     * @param {string} collection 
     */
    constructor(collection) {
        this.name = collection
        this.display = new Display(this.name);
    }

    findDocument(document) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty." };
        const scoreboard = world.scoreboard.getObjective(this.name);
    }

    insertDocument(document, json) { 
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty." };
    }

    updateDocument(document, json) { 
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty." };

    }

    existsDocument(document) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty." };
        
    }

    sizeCollection() {
        return 0;
    }

} 


class Display {
    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
    }

    list() {
        system.run(() => overworld.runCommand(`scoreboard objectives setdisplay list "${this.name}"`));
        return { response: "setdisplay list", status: "ok" };
    }

    sidebar() {
        system.run(() => overworld.runCommand(`scoreboard objectives setdisplay sidebar "${this.name}"`));
        return { response: "setdisplay sidebar", status: "ok" };
    }

    belowname() {
        system.run(() => overworld.runCommand(`scoreboard objectives setdisplay belowname "${this.name}"`));
        return { response: "setdisplay belowname", status: "ok" };
    }

    noList() {
        system.run(() => overworld.runCommand(`scoreboard objectives setdisplay list`));
        return { response: "setdisplay no list", status: "ok" };
    }

    noSidebar() { 
        system.run(() => overworld.runCommand(`scoreboard objectives setdisplay sidebar`));
        return { response: "setdisplay no sidebar", status: "ok" };
    }

    noBelowname() {
        system.run(() => overworld.runCommand(`scoreboard objectives setdisplay belowname`));
        return { response: "setdisplay no belowname", status: "ok" };
    }

}

class Cluster {
    constructor() {
        this.MAX_DOCUMENT_IN_COLLECTION = 5000;
    }
    
    create() {

    }

    search() {

    }

    find() {

    }

    size() {

    }
}

function loadRegisterDatabase() {

    if(registerAdded != 0) throw new Error("Root Database already exists.");
    const register = world.scoreboard.getObjective();

    const data = escapeQuotes(JSON.stringify({document: {
        name: "root",
        id: register.getParticipants().length + 1,
    },
    data: {
        users: [{user: "root", password: "root"}],
        databases: [],
    }}))
    
    system.run(() => {
        if(register.hasParticipant(data) == false) {
            register.setScore(data, 0)
        }
    })
}

function InitializationIsReady() {
    if(ready == false) throw new Error("Initialization is not ready");
}

/**
 * @param {String} jsonString 
 * @returns {Object}
 */
function JParse(jsonString) {

    if(typeof jsonString  == "object") return { json: jsonString, isValid: true };
    
    try {
        const jsonParse = JSON.parse(jsonString);
        return { json: jsonParse, isValid: true };
    }catch {
        return { json: null, isValid: false };
    }
}

/**
 * @param {string} jsonString 
 * @returns {Object}
 */
function escapeQuotes(jsonString) {
    return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * @param {string} jsonString 
 * @returns {Object}
 */
function unescapeQuotes(jsonString) {
    return jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

class XOR {
    /**
     * @param {string} ciphertext
     * @returns {string}
     */
    decrypt(ciphertext) {
        return new XOREncryption(NMDBkey).Decrypt(ciphertext);
    }

    /**
     * @param {string} key 
     */
    setKey(key) {
        if(typeof key == "string") {
            if(key.length == 16) {
                NMDBkey = key;
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
        return NMDBkey;
    }

    /**
     * @param {string} plaintext 
     * @returns 
     */
    encrypt(plaintext) {
        return new XOREncryption(NMDBkey).Encrypt(plaintext);
    }
}

//Not 100% sure
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
