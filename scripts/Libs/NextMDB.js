import { world, system } from "@minecraft/server";

const overworld = world.getDimension("minecraft:overworld");
const NextMap = new Map();

let config = {
    ready: false,
    NMDBkey: "DATABASE:NEXTMDB",
    limitCollection: 5000,
}

let developmentMode = {
    notification: false,
    reloadRegister: false,
}

let regex = {
    whitespace: /\s+/g,
    character: /[^\w\s]/gi,
}

export class NextMDB {
    
    /**
     * @param {string} name 
     * @returns {Collection}
     */
    Collection(name) {
        InitializationIsReady()
        if(typeof name != "string") throw new Error("Name is invalid");
        return new Collection(name.toUpperCase())
    }

    createCollection(name) {
        InitializationIsReady();
        if(typeof name != "string") throw new Error("Name is invalid");
        const rootDocument = NextMap.get("root");
        const databases = rootDocument.data.databases;
        name = name.replace(regex.whitespace, " ").replace(regex.character, "");
        
    }

    resetCollection() {
        InitializationIsReady();
    }

    deleteColection() {
        InitializationIsReady();
    }
    

    getAllCollection() {
        InitializationIsReady();
    }

    resetAllCollection() {
        InitializationIsReady();
    }

    sizeCollections() {
        InitializationIsReady();
    }

    /**
     * @returns {XOR} 
     */
    XOR() {
        return new XOR()
    }

    developmentMode({notification: notification, reloadRegister: reloadRegister}) {

        if(typeof notification == "boolean") {
            developmentMode.notification = notification ?? false;
        }

        if(typeof reloadRegister == "boolean") {
            developmentMode.reloadRegister = reloadRegister ?? false;
        }
    }

    /**
     * @param {boolean} boolean 
     */
    Initialization() {
        config.ready = true;
        loadRegisterDatabase();
        //startLoops();
        sendNotification("§aInitialization was successful.");
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

class Account {

    create() {

    }

    delete() {

    }

    update() {

    }

    login() {

    }

    logout() {

    }

    get() {

    }
}

function updateRegister() {
    const xor = new XOR();
    const register = world.scoreboard.getObjective(xor.Encrypt("root@document"));
    let bool = false;
    register.getParticipants().forEach((participant) => {
        const data = JParse(unescapeQuotes(xor.Decrypt(participant.displayName)));
        if(data.isValid) {
            if(data.json.document.name == "root") {
                system.run(() => {
                    bool = true;
                    register.removeParticipant(participant.displayName);
                    register.setScore(xor.encrypt(escapeQuotes(JSON.stringify(NextMap.get("root")))))
                    return;
                })
            }
        }
        system.run(() => register.removeParticipant(participant.displayName));
    })

    if(bool) {
        return { response: "updated.", status: "ok" };
    } else {
        return { response: "no update", status: "no" };
    }
}

function loadRegisterDatabase() {

    const xor = new XOREncryption(config.NMDBkey);
    const registerName = xor.Encrypt("root@document");
    const register = world.scoreboard.getObjective(registerName);
    let bool = false;

    if(developmentMode.reloadRegister) {
        world.scoreboard.removeObjective(registerName);
    }

    if(!world.scoreboard.getObjectives().find((scoreboard) => scoreboard.displayName == registerName)) {
        world.scoreboard.addObjective(registerName, registerName);
    }

    const JData = {
        document: {
            name: "root",
            id: register.getParticipants().length + 1,
        },
        data: {
            users: [],
            databases: [],
        }
    }

    const data = xor.Encrypt(escapeQuotes(JSON.stringify(JData)))

    register.getParticipants().forEach((participant) => {
        const data = JParse(unescapeQuotes(xor.Decrypt(participant.displayName)));
        if(data.isValid) {
            if(data.json.document.name == "root") {
                bool = true;
                NextMap.set("root", data.json);
                return;
            }
        }

        system.run(() => register.removeParticipant(participant.displayName));
    })

    if(bool == false) {
        system.run(() => register.setScore(data, 0))
        NextMap.set("root", JData);
    }
}

function startLoops() {
    system.runInterval(() => {
        console.warn("i am here")
    }, 20);
}

function InitializationIsReady() {
    if(config.ready == false) throw new Error("Initialization is not ready");
}

function sendNotification(message) {
    if(developmentMode.notification) {
        world.sendMessage(`§7[§6NextMDB§7] ` + message);
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
