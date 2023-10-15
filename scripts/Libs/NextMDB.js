import { world, system } from "@minecraft/server";

let config = {
    NMDBkey: "DATABASE:NEXTMDB",
    limitCollection: 5000,
    rootDocumentName: "root@document",
    registerReady: false,
    initReady: false,
}

let developmentMode = {
    notification: false,
    reloadCollection: false,
}

let regex = {
    whitespace: /\s+/g,
    character: /[^\w\s]/gi,
    documentName: /"document"\s*:\s*\{\s*"name"\s*:\s*"([^"]+)"\s*/
}

export class BetterMap {

    #map = new Map();
    #onChangeCallback = () => {};

    callback(callback) {
        this.#onChangeCallback = callback;
    }

    set(key, value, event) {

        if(typeof event == "undefined") {
            event = null;
        }

        this.#onChangeCallback(key, value, "set", event);
        this.#map.set(key, value);
    }

    get(key, event) {

        if(typeof event == "undefined") {
            event = null;
        }

        this.#onChangeCallback(key, null, "get", event);
        return this.#map.get(key);
    }

    delete(key, event) {

        if(typeof event == "undefined") {
            event = null;
        }

        const value = this.#map.get(key);
        this.#map.delete(key);
        this.#onChangeCallback(key, value, "delete", event);
    }
}

const overworld = world.getDimension("minecraft:overworld");
const NextMap = new BetterMap();

export class NextMDB {

    /**
     * @param {string} name 
     * @returns {Collection}
     */
    Collection(name) {
        initReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");
        if(this.existsCollecton(name)) {
            return new Collection(name)
        } else {
            throw new Error("Collection not found");
        }
    }

    existsCollecton(name) {
        initReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");

        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            if(database.name == name) {
                return true;
            }
        }

        return false;
    }

    createCollection(name) {
        initReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");

        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            if(database.name == name) {
                return { response: "Collection exist", status: "no" };
            }
        }

        const xor = new XOR();
        const firstColletionName = `${name}#1`;
        const firstColletionID = xor.encrypt(firstColletionName)
        rootDocument.content.databases.push({name: name, subs:[{collection: firstColletionName, id: firstColletionID}]})
        world.scoreboard.addObjective(firstColletionID, firstColletionName);
        setRootDocument(rootDocument, "update")
        return { response: "Collection created", status: "ok" };

    }

    deleteColection(name) {
        initReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");

        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            if(database.name == name) {
                const sub = database.sub;
                world.scoreboard.removeObjective(sub.id);
                rootDocument.content.databases.splice(i, 1);
                setRootDocument(rootDocument, "update");
                return { response: "Collection deleted", status: "ok" };
            }
        }

        return { response: "Collection not eixsts", status: "no" };
    }

    /**
     * @returns { [{name: name, subs: [{collection: collection}]}] }
     */
    getAllCollection() {
        initReady();
        return getRootDocument().content.databases;
    }

    /**
     * @returns { {collection: {name?: name, subs?: [{collection?: collection, id?: id}]} response: response, status: status} }
     */
    getCollection(name) {
        initReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");

        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            if(database.name == name) {
                return { response: "Collection eixts",  status: "ok", collection: database };
            }
        }

        return { response: "Collection not eixsts", status: "no" };
    }

    resetAllCollection() {
        initReady();

        const databases = getRootDocument().content.databases;
        const databasesLength = databases.length;
        let scan = 0;

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            const subs = database.subs;
            const subsLength = subs.length;
            for(let s = 0; s < subsLength; s++) { 
                const sub = subs[s];
                world.scoreboard.removeObjective(sub.id);
                world.scoreboard.addObjective(sub.id, sub.collection);
                scan++;
            }
        }

        if(scan == 0) {
            return { response: "Collection is empty", reset: scan, status: "no" };
        } else {
            return { response: "Collection rested", reset: scan, status: "ok"};
        }
    }

    resetCollection(name) {
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");

        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;
        let scan = 0; 

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            if(database.name == name) {
                const subs = database.subs;
                const subsLength = subs.length;
                for(let s = 0; s < subsLength; s++) {
                    const sub = subs[s];
                    world.scoreboard.removeObjective(sub.id);
                    world.scoreboard.addObjective(sub.id, sub.collection);
                    scan++;
                }

                if(scan == 0) {
                    return { response: "No collection (WARNING API ERROR)", reset: scan, status: "no"};
                } else {
                    return { response: "Collection reseted", reset: scan, status: "ok"};
                }

            }
        }

        return { response: "Collection not eixsts", status: "no" };

    }

    /**
     * @returns {Number}
     */
    sizeCollections() {
        initReady();
        return getRootDocument().content.databases.length;
    }

    /**
     * @returns { {collection: {name?: name, documents: documents, subsCollection: subsCollection, subs?: [{collection?: collection, id?: id}]} response: response, status: status} }
     */
    sizeCollection(name) {
        initReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");

        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            if(database.name == name) {
                const subs = database.subs;
                const subsLength = subs.length;
                let collection = {
                    name: database.name,
                    documents: 0,
                    subsCollection: subsLength,
                    subs: [],
                };

                for(let s = 0; s < subsLength; i++) {
                    const sub = subs[i];
                    const documentsLenght = world.scoreboard.getObjective(sub.id).getParticipants().length;
                    collection.documents = collection.documents += documentsLenght;
                    collection.subs.push({collection: sub.name, id: sub.id, documents: documentsLenght});
                }

                return { collection: collection, response: "Collection exists", status: "ok" } 
            }
        }

        return { response: "Collection not eixsts", status: "no" };
    }

    Display(name, subNumber) {
        initReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        name = name.replace(regex.character, "");
        if(name.length == 0) throw new Error("Name is 0");
        if(typeof subNumber != "number") throw new Error("SubNumber is invalid");

        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;

        for(let i = 0; i < databasesLength; i++) {
            const database = databases[i];
            if(database.name == name) {
                const id = database.subs[subNumber - 1];
                if(id != undefined) {
                    return new Display(id.id);
                } else {
                    throw new Error("Subs not exists");
                }
            }
        }

        throw new Error("Collection not exists");
    }

    /**
     * @returns {XOR} 
     */
    XOR() {
        return new XOR()
    }

    developmentMode({notification: notification, reloadCollection: reloadCollection}) {

        if(typeof notification == "boolean") {
            developmentMode.notification = notification ?? false;
        }

        if(typeof reloadCollection == "boolean") {
            developmentMode.reloadCollection = reloadCollection ?? false;
        }
    }

    init() {
        if(developmentMode.reloadCollection) {
            world.scoreboard.getObjectives().forEach((scoreboard) => {
                world.scoreboard.removeObjective(scoreboard.id);
            })
        }

        registerScoreboard();
        config.initReady = true;
    }
}

class Collection {

    #cluster = new Cluster();

    /**
    * @param {string} collection 
    */
    constructor(collection) {
        this.collection = collection;
    }

    findDocument(document) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty.", status: "no" };
        this.#cluster.search(this.collection);

    }

    insertDocument(document, json) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty.", status: "no" };
        if(typeof json != "object") return { response: "The json is not a object.", status: "no" };
        
    }

    updateDocument(document, json) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty.", status: "no" };

    }

    existsDocument(document) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty.", status: "no" };
        
    }

    sizeCollection() {
        return 0;
    }
} 

class Cluster {

    /**
     * @returns {{name: string, subs: [{collection: string, id: string}]}}
     */
    #getCollecttion = (collection) => {
        const rootDocument = getRootDocument();
        const databases = rootDocument.content.databases;
        const databasesLength = databases.length;
        for(let i = 0; i < databasesLength; i++) { 
            const database = databases[i];
            if(database.name == collection) {
                return database;
            }
        }

        throw new Error('NextMinecraftDatabase API CLUSTER ERROR: getCollection. {message: "collection not found"}');
    }

    find() {
    }

    search(collection) {
        const getCollection = this.#getCollecttion(collection);

    }
}

export class Display {
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

class XOR {
    /**
     * @param {string} ciphertext
     * @returns {string}
     */
    decrypt(ciphertext) {
        return new XOREncryption(config.NMDBkey).Decrypt(ciphertext);
    }

    /**
     * @param {string} key 
     */
    setKey(key) {
        if(typeof key == "string") {
            if(key.length == 16) {
                config.NMDBkey = key;
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
        return config.NMDBkey;
    }

    /**
     * @param {string} plaintext 
     * @returns 
     */
    encrypt(plaintext) {
        return new XOREncryption(config.NMDBkey).Encrypt(plaintext);
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

export function sendMessageWitMDB(message) {
    if(developmentMode.notification) {
        world.sendMessage(`§7[§6NextMDB§7]§r ` + message);
    }
}

/**
 * @param {String} jsonString
 */
export function JParse(jsonString) {

    if(typeof jsonString  == "object") return { json: jsonString, isValid: true };
    
    try {
        const jsonParse = JSON.parse(jsonString);
        return { json: jsonParse, isValid: true };
    }catch {
        return { json: {}, isValid: false };
    }
}

/**
 * @param {string} jsonString 
 * @returns {string}
 */
export function escapeQuotes(jsonString) {
    return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * @param {string} jsonString 
 * @returns {string}
 */
export function unescapeQuotes(jsonString) {
    return jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function registerScoreboard() {
    const xor = new XOR();
    const id = xor.encrypt(config.rootDocumentName);

    if(config.registerReady) {
        return world.scoreboard.getObjective(id);
    }

    let findScoreboard = null;
    const scoreboards = world.scoreboard.getObjectives();
    const scoreboardsLength = scoreboards.length;

    for(let i = 0; i < scoreboardsLength; i++) { 
        const scoreboard = scoreboards[i];
        if(scoreboard.id == id) {
            findScoreboard = scoreboard;
            break;
        }
    }

    if(findScoreboard == null) {
        world.scoreboard.addObjective(id, config.rootDocumentName);
    }

    const scoreboard = world.scoreboard.getObjective(id);
    const participantLength = scoreboard.getParticipants().length;
    let documentName = null;

    for(let i = 0; i < participantLength; i++) {
        const participant = scoreboard.getParticipants()[i];
        const document = unescapeQuotes(xor.decrypt(participant.displayName));
        if(getDocumentName(document) == config.rootDocumentName) {
            documentName = document;
            break;
        } else {
            scoreboard.removeParticipant(participant.displayName);
        }
    }

    if(documentName == null) {
        const document = {
            document: {
                name: config.rootDocumentName,
            },
            content: {
                users: [],
                databases: []
            }
        }
        const data = xor.encrypt(escapeQuotes(JSON.stringify(document)));
        scoreboard.setScore(data, 0);
        setRootDocument(document, "createRegister");
    } else {
        const Parse = JParse(unescapeQuotes(xor.decrypt(documentName)));
        if(Parse.isValid) {
            setRootDocument(Parse.json, "loadRegisterFromDatabase")
        }
    }

    config.registerReady = true;
    return world.scoreboard.getObjective(id);
}

function getDocumentName(jsonString) {
    return jsonString.match(regex.documentName)[1];
}

function getRootDocument() {
    return NextMap.get("root", "register");
} 

function setRootDocument(value, event) {
    return NextMap.set("root", value, event);
}

function initReady() { 
    if(config.initReady == false) {
        throw new Error("Init is not ready!");
    }
}

export function isNumberInRange(number, min, max) {
    return number >= min && number <= max;
}

export function isNotLimitCollection(number) {
    return isNumberInRange(number, 0, config.limitCollection);
}

export function calculateByteSize(str) {
    let byteSize = 0;

    for(let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode <= 0x7F) {
            byteSize += 1;
        } else if (charCode <= 0x7FF) {
            byteSize += 2;
        } else if (charCode <= 0xFFFF) {
            byteSize += 3;
        } else {
            byteSize += 4;
        }
    }
    return byteSize;
}
  
NextMap.callback((key, value, action, event) => {
    console.warn(action)
    if(action == "set") {
        const xor = new XOR();
        if(event == "update") {
            const register = registerScoreboard();
            const registerLength = register.getParticipants().length;
            for(let i = 0; i < registerLength; i++) { 
                const participant = register.getParticipants()[i];
                const searchRootDocument = unescapeQuotes(xor.decrypt(participant.displayName));
                if(getDocumentName(searchRootDocument) == config.rootDocumentName) {
                    register.removeParticipant(participant.displayName);
                    register.setScore(escapeQuotes(xor.encrypt(JSON.stringify(value))), 0);
                    return;
                }
                register.removeParticipant(participant.displayName);
            }
        }
        return;
    } else if(action == "get") {
        return;
    } else if(action == "delete") {
        return;
    }
})
