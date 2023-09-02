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

export class SecurityNextMDB {
    constructor(key) {
        this.key = key;
    }

    /**
     * @param {string} plaintext 
     * @returns {string}
     */
    encrypt(plaintext) {
        return aesEncrypt(plaintext, this.key);
    }

    /**
     * @param {string} ciphertext 
     * @returns {string}
     */
    decrypt(ciphertext) {
        return aesDecrypt(ciphertext, this.key);
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


//---------------------------------------------------------------------------------------AES---------------------------------------------------------------------------------------------------//
const SBOX = [
    0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,
    0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0,
    0xB7, 0xFD, 0x93, 0x26, 0x36, 0x3F, 0xF7, 0xCC, 0x34, 0xA5, 0xE5, 0xF1, 0x71, 0xD8, 0x31, 0x15,
    0x04, 0xC7, 0x23, 0xC3, 0x18, 0x96, 0x05, 0x9A, 0x07, 0x12, 0x80, 0xE2, 0xEB, 0x27, 0xB2, 0x75,
    0x09, 0x83, 0x2C, 0x1A, 0x1B, 0x6E, 0x5A, 0xA0, 0x52, 0x3B, 0xD6, 0xB3, 0x29, 0xE3, 0x2F, 0x84,
    0x53, 0xD1, 0x00, 0xED, 0x20, 0xFC, 0xB1, 0x5B, 0x6A, 0xCB, 0xBE, 0x39, 0x4A, 0x4C, 0x58, 0xCF,
    0xD0, 0xEF, 0xAA, 0xFB, 0x43, 0x4D, 0x33, 0x85, 0x45, 0xF9, 0x02, 0x7F, 0x50, 0x3C, 0x9F, 0xA8,
    0x51, 0xA3, 0x40, 0x8F, 0x92, 0x9D, 0x38, 0xF5, 0xBC, 0xB6, 0xDA, 0x21, 0x10, 0xFF, 0xF3, 0xD2,
    0xCD, 0x0C, 0x13, 0xEC, 0x5F, 0x97, 0x44, 0x17, 0xC4, 0xA7, 0x7E, 0x3D, 0x64, 0x5D, 0x19, 0x73,
    0x60, 0x81, 0x4F, 0xDC, 0x22, 0x2A, 0x90, 0x88, 0x46, 0xEE, 0xB8, 0x14, 0xDE, 0x5E, 0x0B, 0xDB,
    0xE0, 0x32, 0x3A, 0x0A, 0x49, 0x06, 0x24, 0x5C, 0xC2, 0xD3, 0xAC, 0x62, 0x91, 0x95, 0xE4, 0x79,
    0xE7, 0xC8, 0x37, 0x6D, 0x8D, 0xD5, 0x4E, 0xA9, 0x6C, 0x56, 0xF4, 0xEA, 0x65, 0x7A, 0xAE, 0x08,
    0xBA, 0x78, 0x25, 0x2E, 0x1C, 0xA6, 0xB4, 0xC6, 0xE8, 0xDD, 0x74, 0x1F, 0x4B, 0xBD, 0x8B, 0x8A,
    0x70, 0x3E, 0xB5, 0x66, 0x48, 0x03, 0xF6, 0x0E, 0x61, 0x35, 0x57, 0xB9, 0x86, 0xC1, 0x1D, 0x9E,
    0xE1, 0xF8, 0x98, 0x11, 0x69, 0xD9, 0x8E, 0x94, 0x9B, 0x1E, 0x87, 0xE9, 0xCE, 0x55, 0x28, 0xDF,
    0x8C, 0xA1, 0x89, 0x0D, 0xBF, 0xE6, 0x42, 0x68, 0x41, 0x99, 0x2D, 0x0F, 0xB0, 0x54, 0xBB, 0x16
];

const INVERSE_SBOX = [
    0x52, 0x09, 0x6A, 0xD5, 0x30, 0x36, 0xA5, 0x38, 0xBF, 0x40, 0xA3, 0x9E, 0x81, 0xF3, 0xD7, 0xFB,
    0x7C, 0xE3, 0x39, 0x82, 0x9B, 0x2F, 0xFF, 0x87, 0x34, 0x8E, 0x43, 0x44, 0xC4, 0xDE, 0xE9, 0xCB,
    0x54, 0x7B, 0x94, 0x32, 0xA6, 0xC2, 0x23, 0x3D, 0xEE, 0x4C, 0x95, 0x0B, 0x42, 0xFA, 0xC3, 0x4E,
    0x08, 0x2E, 0xA1, 0x66, 0x28, 0xD9, 0x24, 0xB2, 0x76, 0x5B, 0xA2, 0x49, 0x6D, 0x8B, 0xD1, 0x25,
    0x72, 0xF8, 0xF6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xD4, 0xA4, 0x5C, 0xCC, 0x5D, 0x65, 0xB6, 0x92,
    0x6C, 0x70, 0x48, 0x50, 0xFD, 0xED, 0xB9, 0xDA, 0x5E, 0x15, 0x46, 0x57, 0xA7, 0x8D, 0x9D, 0x84,
    0x90, 0xD8, 0xAB, 0x00, 0x8C, 0xBC, 0xD3, 0x0A, 0xF7, 0xE4, 0x58, 0x05, 0xB8, 0xB3, 0x45, 0x06,
    0xD0, 0x2C, 0x1E, 0x8F, 0xCA, 0x3F, 0x0F, 0x02, 0xC1, 0xAF, 0xBD, 0x03, 0x01, 0x13, 0x8A, 0x6B,
    0x3A, 0x91, 0x11, 0x41, 0x4F, 0x67, 0xDC, 0xEA, 0x97, 0xF2, 0xCF, 0xCE, 0xF0, 0xB4, 0xE6, 0x73,
    0x96, 0xAC, 0x74, 0x22, 0xE7, 0xAD, 0x35, 0x85, 0xE2, 0xF9, 0x37, 0xE8, 0x1C, 0x75, 0xDF, 0x6E,
    0x47, 0xF1, 0x1A, 0x71, 0x1D, 0x29, 0xC5, 0x89, 0x6F, 0xB7, 0x62, 0x0E, 0xAA, 0x18, 0xBE, 0x1B,
    0xFC, 0x56, 0x3E, 0x4B, 0xC6, 0xD2, 0x79, 0x20, 0x9A, 0xDB, 0xC0, 0xFE, 0x78, 0xCD, 0x5A, 0xF4,
    0x1F, 0xDD, 0xA8, 0x33, 0x88, 0x07, 0xC7, 0x31, 0xB1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xEC, 0x5F,
    0x60, 0x51, 0x7F, 0xA9, 0x19, 0xB5, 0x4A, 0x0D, 0x2D, 0xE5, 0x7A, 0x9F, 0x93, 0xC9, 0x9C, 0xEF,
    0xA0, 0xE0, 0x3B, 0x4D, 0xAE, 0x2A, 0xF5, 0xB0, 0xC8, 0xEB, 0xBB, 0x3C, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2B, 0x04, 0x7E, 0xBA, 0x77, 0xD6, 0x26, 0xE1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0C, 0x7D,
];

const state = [
    [0x32, 0x88, 0x31, 0xe0],
    [0x43, 0x5a, 0x31, 0x37],
    [0xf6, 0x30, 0x98, 0x07],
    [0xa8, 0x8d, 0xa2, 0x34]
];

function aesEncrypt(plaintext, key) {
    if(key.length !== 16) {
        throw new Error("Der Schlüssel muss 16 Bytes lang sein.");
    }
    const plaintextBytes = stringToBytes(plaintext);
    const keyBytes = stringToBytes(key);
    const roundKeys = keyExpansion(keyBytes);

    addRoundKey(state, roundKeys, 0);
    for(let round = 1; round < 10; round++) {
        subBytes(state);
        shiftRows(state);
        mixColumns(state);
        addRoundKey(state, roundKeys, round);
    }

    subBytes(state);
    shiftRows(state);
    addRoundKey(state, roundKeys, 10);
    const ciphertext = bytesToHexString(plaintextBytes);

    return ciphertext;
}

function aesDecrypt(ciphertext, key) {
    if(key.length !== 16) {
        throw new Error("Der Schlüssel muss 16 Bytes lang sein.");
    }

    const ciphertextBytes = hexStringToBytes(ciphertext);
    const keyBytes = stringToBytes(key);
    const roundKeys = keyExpansion(keyBytes);

    addRoundKey(state, roundKeys, 10);
    for(let round = 9; round > 0; round--) {
        inverseShiftRows(state);
        inverseSubBytes(state);
        addRoundKey(state, roundKeys, round);
        inverseMixColumns(state);
    }

    inverseShiftRows(state);
    inverseSubBytes(state);
    addRoundKey(state, roundKeys, 0);
    const plaintext = bytesToString(ciphertextBytes);

    return plaintext;
}

function hexStringToBytes(hexString) {
    const bytes = [];
    for(let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return bytes;
}

function bytesToHexString(bytes) {
    return bytes.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function stringToBytes(string) {
    const utf8 = unescape(encodeURIComponent(string));
    const bytes = [];
    for(let i = 0; i < utf8.length; i++) {
        bytes.push(utf8.charCodeAt(i));
    }
    return bytes;
}

function bytesToString(bytes) {
    const utf8 = String.fromCharCode.apply(null, bytes);
    return decodeURIComponent(escape(utf8));
}

function keyExpansion(key) {
    const Nk = key.length / 4;
    const Nr = Nk + 6;
    const Nb = 4;

    const RCON = [
        [0x00, 0x00, 0x00, 0x00],
        [0x01, 0x00, 0x00, 0x00],
        [0x02, 0x00, 0x00, 0x00],
        [0x04, 0x00, 0x00, 0x00],
        [0x08, 0x00, 0x00, 0x00],
        [0x10, 0x00, 0x00, 0x00],
        [0x20, 0x00, 0x00, 0x00],
        [0x40, 0x00, 0x00, 0x00],
        [0x80, 0x00, 0x00, 0x00],
        [0x1B, 0x00, 0x00, 0x00],
        [0x36, 0x00, 0x00, 0x00],
    ];
    
    const words = [];

    for(let i = 0; i < Nk; i++) {
        words[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
    }

    for(let i = Nk; i < Nb * (Nr + 1); i++) {
        let temp = [...words[i - 1]];

        if(i % Nk === 0) {
            temp.push(temp.shift());
            for (let j = 0; j < 4; j++) {
                temp[j] = SBOX[temp[j]];
            }
            temp[0] ^= RCON[i / Nk];
        } else if(Nk > 6 && i % Nk === 4) {
            for(let j = 0; j < 4; j++) {
                temp[j] = SBOX[temp[j]];
            }
        }
        words[i] = [];
        for(let j = 0; j < 4; j++) {
            words[i][j] = words[i - Nk][j] ^ temp[j];
        }
    }

    return words;
}

function addRoundKey(state, roundKeys, round) {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            state[i][j] ^= roundKeys[round * 4 + i][j];
        }
    }
}

function subBytes(state) {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            state[i][j] = SBOX[state[i][j]];
        }
    }
}

function shiftRows(state) {
    for(let i = 1; i < 4; i++) {
        for(let j = 0; j < i; j++) {
            const temp = state[i].shift();
            state[i].push(temp);
        }
    }
}

function mixColumns(state) {
    for(let i = 0; i < 4; i++) {
        const s0 = state[0][i];
        const s1 = state[1][i];
        const s2 = state[2][i];
        const s3 = state[3][i];

        state[0][i] = multiply(s0, 0x02) ^ multiply(s1, 0x03) ^ s2 ^ s3;
        state[1][i] = s0 ^ multiply(s1, 0x02) ^ multiply(s2, 0x03) ^ s3;
        state[2][i] = s0 ^ s1 ^ multiply(s2, 0x02) ^ multiply(s3, 0x03);
        state[3][i] = multiply(s0, 0x03) ^ s1 ^ s2 ^ multiply(s3, 0x02);
    }
}

function multiply(a, b) {
    if(a & 0x80) {
        a ^= 0x1B;
        a <<= 1;
        b ^= 0x01;
    }
    let result = 0;
    while(b > 0) {
        if (b & 0x01) {
            result ^= a;
        }
        a <<= 1;
        if(a & 0x100) {
            a ^= 0x1B;
        }
        b >>= 1;
    }
    return result;
}

function inverseShiftRows(state) {
    for(let i = 1; i < 4; i++) {
        for (let j = 0; j < i; j++) {
            const temp = state[i].pop();
            state[i].unshift(temp);
        }
    }
}

function inverseSubBytes(state) {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            state[i][j] = INVERSE_SBOX[state[i][j]];
        }
    }
}

function inverseMixColumns(state) {
    for(let c = 0; c < 4; c++) {
        const a = state[0][c];
        const b = state[1][c];
        const h = state[2][c];
        const g = state[3][c];

        state[0][c] = multiply(0x0E, a) ^ multiply(0x0B, b) ^ multiply(0x0D, h) ^ multiply(0x09, g);
        state[1][c] = multiply(0x09, a) ^ multiply(0x0E, b) ^ multiply(0x0B, h) ^ multiply(0x0D, g);
        state[2][c] = multiply(0x0D, a) ^ multiply(0x09, b) ^ multiply(0x0E, h) ^ multiply(0x0B, g);
        state[3][c] = multiply(0x0B, a) ^ multiply(0x0D, b) ^ multiply(0x09, h) ^ multiply(0x0E, g);
    }
}