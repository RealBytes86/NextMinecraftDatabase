import { world, system } from "@minecraft/server";

const overworld = world.getDimension("minecraft:overworld");
export const NextMap = new Map();

let config = {
    NMDBkey: "DATABASE:NEXTMDB",
    limitCollection: 5000,
    rootDocumentName: "root@document",
    registerReady: false,
}

let developmentMode = {
    notification: false,
}

let regex = {
    whitespace: /\s+/g,
    character: /[^\w\s]/gi,
    documentName: /"document"\s*:\s*\{\s*"name"\s*:\s*"([^"]+)"\s*,/
}

export class NextMDB {
    
    constructor() {
        this.utils = {
            JParse,
            sendNotification,
            unescapeQuotes,
            escapeQuotes,
        }
    }

    /**
     * @param {string} name 
     * @returns {Collection}
     */
    Collection(name) {
        if(typeof name != "string") throw new Error("Name is invalid");
        return new Collection(name)
    }

    createCollection() {
        registerScoreboard();
    }

    resetCollection() {

    }

    deleteColection() {

    }

    /**
     * @returns { [{name: name, subs: [{collection: collection}]}] }
     */
    getAllCollection() {
        
    }

    /**
     * @returns { {response: string, status: string, json?: {name: name, subs: [{collection: collection}]}} }
     */
    getSubsCollection(collection) { 

    }

    resetAllCollection() {

    }

    sizeCollections() {

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
            if(reloadCollection) {
                world.scoreboard.getObjectives().forEach((scoreboard) => world.scoreboard.removeObjective(scoreboard.id));
            }
        }
    }
}

class Collection {
    /**
     * @param {string} collection 
     */
    constructor(collection) {
        this.name = collection
    }

    findDocument(document) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty.", status: "no" };
        const scoreboard = world.scoreboard.getObjective(this.name);
    }

    insertDocument(document, json) {
        if(typeof document !== "string") return { response: "The document name is not a string.", status: "no" };
        if(document.length == 0) return { response: "The document name is empty.", status: "no" };
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

    create() {

    }

    search() {

    }

    find() {

    }

    size() {

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

function sendNotification(message) {
    if(developmentMode.notification) {
        world.sendMessage(`§7[§6NextMDB§7]§r ` + message);
    }
}

/**
 * @param {String} jsonString
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
 * @returns {string}
 */
function escapeQuotes(jsonString) {
    return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * @param {string} jsonString 
 * @returns {string}
 */
function unescapeQuotes(jsonString) {
    return jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function registerScoreboard() {
    const xor = new XOR();
    const id = xor.encrypt(config.rootDocumentName);

    if(config.registerReady) {
        return world.scoreboard.getObjective(id);
    }

    const findScoreboard = world.scoreboard.getObjectives().find((scoreboard) => scoreboard.id == id);

    if(findScoreboard == undefined) {
        world.scoreboard.addObjective(id, config.rootDocumentName);
    }

    const scoreboard = world.scoreboard.getObjective(id);

    const findParticipant = scoreboard.getParticipants().find((participant) => {
        const document = unescapeQuotes(xor.decrypt(participant.displayName));
        if (getDocumentName(document) == config.rootDocumentName) {
            return true;
        } else {
            scoreboard.removeParticipant(participant.displayName);
        }
    });
    
    if(findParticipant == undefined) {
        const document = {
            document: {
                name: config.rootDocumentName,
                id: scoreboard.getParticipants().length + 1
            },
            data: {
                users: [],
                databases: [],
            }
        }
        scoreboard.setScore(xor.encrypt(escapeQuotes(JSON.stringify(document))), 0);
        setRootDocument(document)
    } else {
        const Parse = JParse(unescapeQuotes(xor.decrypt(findParticipant.displayName)))
        if(Parse.isValid) {
            setRootDocument(Parse.json);
        }
    }

    config.registerReady = true;
    return world.scoreboard.getObjective(id);
}

function getDocumentName(jsonString) {
    return jsonString.match(regex.documentName)[1];
}

function getRootDocument() {
    return NextMap.get("root");
}

function setRootDocument(value) {
    return NextMap.set("root", value);
}
