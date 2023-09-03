import { world, system, MinecraftDimensionTypes } from "@minecraft/server";

const cache = [];
const overworld = world.getDimension(MinecraftDimensionTypes.overworld);
const nether = world.getDimension(MinecraftDimensionTypes.nether);
const end = world.getDimension(MinecraftDimensionTypes.theEnd);

export class NextMDB {
    /**
     * @param {string} collection 
     */
    constructor(collection) {
        this.name = collection;
        this.display = new Display(collection);
        this.collection = new Collection(collection);
    }

    size() {
        return 0;
    }

    /**
    * @returns {object}
    */
    create() {
        if(world.scoreboard.getObjectives().find((scoreboard) => scoreboard.displayName == this.name)) {
            return  { response: "exists",  status: "no" };
        } else {
            world.scoreboard.addObjective(this.name, this.name);
            return { response: "created",  status: "ok" };
        }
    }

    /**
    * @returns {object}
    */
    delete() {
        if(world.scoreboard.getObjectives().find((scoreboard) => scoreboard.displayName == this.name)) {
            world.scoreboard.removeObjective(this.name);
            return  { response: "exists",  status: "ok" };
        } else {
            return { response: "no exists",  status: "no" };
        }
    }

    /**
    * @returns {object}
    */
    deleteAndcreate() {
        let deleteCount = 0;
        let noDeleteCount = 0;
        try 
        {
            world.scoreboard.removeObjective(this.name);
            deleteCount += 1;
        } catch 
        {
            noDeleteCount += 1;
        }
        try 
        {
            world.scoreboard.addObjective(this.name, this.name);
            deleteCount += 1;
        } catch 
        {
            noDeleteCount += 1;
        }
        return  { response: "reseted",  status: "ok", deleteCount: deleteCount, noDeleteCount: noDeleteCount };
    }
} 

export class CryptoNextMDB {
    XOR(key) {
        return new XOR(key);
    }
}

class RegisterNextMDB {
    constructor() {
        this.register = world.scoreboard.getObjective("RegisterNextMDB");
    }

    create(name) {
        
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

class Collection {
    /**
     * @param {String} name 
     */
    constructor(name) {
        this.name = name;
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

    size() {
        return 0;
    }
}

class Docuemnt {
    constructor() {

    }

    update() {

    }

    delete() {

    }

    output() {

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

/**
 * @param {String} jsonString 
 * @returns {Object}
 */
function getJson(jsonString) {
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
    constructor(key) {
        this.key = key;
    }
    
    /**
     * @param {string} ciphertext
     * @returns {string}
     */
    decrypt(ciphertext) {
        return new XOREncryption(this.key).Decrypt(ciphertext);
    }

    /**
     * 
     * @param {string} plaintext 
     * @returns 
     */
    encrypt(plaintext) {
        return new XOREncryption(this.key).Encrypt(plaintext);
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
