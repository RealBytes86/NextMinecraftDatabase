import { world, Entity, MinecraftDimensionTypes } from "@minecraft/server";


export class NextMDB {

    #isInit = () => {
        if(this.#CONFIG.init == false) {
            throw new Error("Collection is not initialized.");
        }

    }

    #CONFIG = {
        location: { x: 0, y: 0, z: 0},
        identifier: "next:database",
        dimension: MinecraftDimensionTypes.overworld,
        init: false,
    }

    constructor () {
        this.utils = {
            JParse,
            escapeQuotes,
            unescapeQuotes,
        }        
    }

    World(database) {
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        return new World(database);
    }

    Entity(object, database) {
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        return new EEntity(object, database);
    }

    Collection(database) {
        this.#isInit();
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(this.#CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == this.#CONFIG.identifier && collection.nameTag == database) {
                return new Collection(collection);
            }
        }

        throw new Error("Collection not found.")
    }

    existsCollection(database) {
        this.#isInit();
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(this.#CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == this.#CONFIG.identifier && collection.nameTag == database) {
                return true;
            }
        }
        return false;
    }

    createCollection(database) {
        this.#isInit();
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(this.#CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == this.#CONFIG.identifier && collection.nameTag == database) {
                return { succes: false }
            }
        }

        dimension.spawnEntity(this.#CONFIG.identifier, this.#CONFIG.location).nameTag = database

        return { succes: true };
    }

    resetCollection(database) {
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(this.#CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == this.#CONFIG.identifier && collection.nameTag == database) {
                collection.clearDynamicProperties();
                return { succes: true };
            }
        }

        return { succes: false };
    }

    resetALLCollection() {
        this.#isInit();
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(this.#CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == this.#CONFIG.identifier) {
                collection.clearDynamicProperties();
            }
        }

        return { succes: true };
    }

    deleteAllCollection() {
        this.#isInit();
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(this.#CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == this.#CONFIG.identifier) {
                collection.clearDynamicProperties();
                collection.triggerEvent("despawn");
            }
        }

        return { succes: true };
    }


    deleteCollection(database) {
        this.#isInit();
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(this.#CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == this.#CONFIG.identifier && collection.nameTag == database) {
                collection.clearDynamicProperties();
                collection.triggerEvent("despawn");
                return { succes: true };
            }
        }

        return { succes: false };
    }

    initCollection() {
        
        const dimension = world.getDimension(this.#CONFIG.dimension);
        const getBlock = dimension.getBlock(this.#CONFIG.location);

        if(getBlock == undefined) throw new Error("Chunk not found.");
        if(getBlock.typeId != "minecraft:air") dimension.fillBlocks(this.#CONFIG.location, this.#CONFIG.location, "minecraft:air");

        const location = this.#CONFIG.location;

        dimension.runCommandAsync(`tickingarea add ${location.x} ${location.y} ${location.z} ${location.x} ${location.y} ${location.z} NEXT:DATABASE`).then((response) => {
            if(response.successCount == 0) {
                dimension.runCommandAsync(`tickingarea remove NEXT:DATABASE`).then((response) => {
                    if(response.successCount == 1) {
                        dimension.runCommandAsync(`tickingarea add ${location.x} ${location.y} ${location.z} ${location.x} ${location.y} ${location.z} NEXT:DATABASE`);
                    }
                })
            }
        })

        this.#CONFIG.init = true;
    }

    setLocationCollection({x, y, z}, dimension) {

        if(this.#CONFIG.init) throw new Error("Collections have already been initiated.")

        if(typeof x !== "number") throw new Error("x must be a number.");
        if(typeof y !== "number") throw new Error("y must be a number.");
        if(typeof z !== "number") throw new Error("z must be a number."); 

        switch(dimension) {
            case MinecraftDimensionTypes.overworld:
            case "overworld":
            case "normal":
            case 1:
                dimension = MinecraftDimensionTypes.overworld;
                break;
            case MinecraftDimensionTypes.nether:
            case "nether":
            case "hell":
            case 2:
                dimension = MinecraftDimensionTypes.nether;
                break;
            case MinecraftDimensionTypes.theEnd:
            case "theend":
            case "end":
            case 3:
                dimension = MinecraftDimensionTypes.theEnd;
                break;
        }

        this.#CONFIG.location.x = x;
        this.#CONFIG.location.y = y;
        this.#CONFIG.location.z = z;
        this.#CONFIG.dimension = dimension ?? MinecraftDimensionTypes.overworld;

        return { succes: true };
    }

    XOR() {
        return new XOR();
    }
}


class Collection {

    #onChangeCallback = () => {};

    /**
     * @param {Entity} collection 
     */
    constructor(collection) {
        this.collection = collection;
    }

    get(property) {
        if(typeof property == "string") {
            const get = this.collection.getDynamicProperty(property);
            if(get == undefined) return null;
            const J = JParse(unescapeQuotes(get));
            if(J.isValid == false) {
                this.#onChangeCallback("get", property)
                this.collection.setDynamicProperty(get, undefined);
                return { error: "invalid Json" }
            }
            return J.json;
        } else {
            throw new Error("property must be a string.");
        }
    }

    has(property) {
        if(this.collection.getDynamicProperty(property)) {
            return true;
        } else {
            return false;
        }
    }

    set(property, json) {
        if(typeof property != "string") throw new Error("property must be a string.");
        if(typeof json != "object") throw new Error("json must be a object.");
        const J = JParse(json, false);
        if(J.isValid) {
            this.#onChangeCallback("set", property, json);
            this.collection.setDynamicProperty(property, escapeQuotes(J.json));
            return { succes: true };
        } else {
            throw new Error("invalid Json.");
        }
    }

    clear() {
        this.collection.clearDynamicProperties();
        return { succes: true };
    }

    delete(property) {
        if(typeof property != "string") throw new Error("property must be a string.");
        this.#onChangeCallback("delete", property);
        this.entity.setDynamicProperty(property, undefined);
        return { succes: true };
    }

    on(callback) {
        this.#onChangeCallback = callback;
    }

    size() {
        return this.collection.getDynamicPropertyIds().length;
    }

    getByte() {
        return this.collection.getDynamicPropertyTotalByteCount();
    }

}


class EEntity {

    #onChangeCallback = () => {};

    /**
     * @param {Entity} object 
     * @param {string} database 
     */
    constructor(object, database) {
        this.entity = object;
        this.database = database;
    }

    get(property) {
        if(typeof property == "string") {
            const get = this.entity.getDynamicProperty(`${this.database}:${property}`);
            if(get == undefined) return null;
            const J = JParse(unescapeQuotes(get));
            if(J.isValid == false) {
                this.#onChangeCallback("get", property)
                this.entity.setDynamicProperty(get, undefined);
                return { error: "invalid Json" }
            }
            return J.json;
        } else {
            throw new Error("property must be a string");
        }
    }

    has(property) {
        if(this.entity.getDynamicProperty(`${this.database}:${property}`)) {
            return true;
        } else {
            return false;
        }
    }

    set(property, json) {
        if(typeof property != "string") throw new Error("property must be a string.");
        if(typeof json != "object") throw new Error("json must be a object.");
        const J = JParse(json, false);
        if(J.isValid) {
            this.#onChangeCallback("set", property, json);
            this.entity.setDynamicProperty(`${this.database}:${property}`, escapeQuotes(J.json));
            return { succes: true };
        } else {
            throw new Error("invalid Json.");
        }
    }

    ClearDatabaseEntity() {
        this.entity.clearDynamicProperties();
        return { succes: true };
    }

    delete(property) {
        if(typeof property != "string") throw new Error("property must be a string.");
        this.#onChangeCallback("delete", property);
        this.entity.setDynamicProperty(`${this.database}:${property}`, undefined);
        return { succes: true };
    }

    on(callback) {
        this.#onChangeCallback = callback;
    }

    size() {
        return this.entity.getDynamicPropertyIds().filter((item) => item.startsWith(this.database)).length;
    }

    getByte() {
        return this.entity.getDynamicPropertyTotalByteCount();
    }
}

class World {

    #onChangeCallback = () => {};

    constructor(database) {
        this.database = database;
    }

    on(callback) {
        this.#onChangeCallback = callback;
    }

    get(property) {
        if(typeof property == "string") {
            const get = world.getDynamicProperty(`${this.database}:${property}`);
            if(get == undefined) return null;
            const J = JParse(unescapeQuotes(get));
            if(J.isValid == false) {
                this.#onChangeCallback("get", property)
                world.setDynamicProperty(get, undefined);
                return { error: "invalid Json" }
            }
            return J.json;
        } else {
            throw new Error("property must be a string.");
        }
    }

    has(property) {
        if(world.getDynamicProperty(`${this.database}:${property}`)) {
            return true;
        } else {
            return false;
        }
    }

    set(property, json) {
        if(typeof property != "string") throw new Error("property must be a string.");
        if(typeof json != "object") throw new Error("json must be a object.");
        const J = JParse(json, false);
        if(J.isValid) {
            this.#onChangeCallback("set", property, json);
            world.setDynamicProperty(`${this.database}:${property}`, escapeQuotes(J.json));
            return { succes: true };
        } else {
            throw new Error("invalid Json.");
        }
    }

    delete(property) {
        if(typeof property != "string") throw new Error("property must be a string.");
        this.#onChangeCallback("delete", property);
        world.setDynamicProperty(`${this.database}:${property}`, undefined);
        return { succes: true };
    }

    ClearAllDatabase() {
        world.clearDynamicProperties();
        return { succes: true };
    }

    size() {
        return world.getDynamicPropertyIds().filter((item) => item.startsWith(this.database)).length;
    }

    getByte() {
        return world.getDynamicPropertyTotalByteCount();
    }
}

function escapeQuotes(jsonString) {
    return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function unescapeQuotes(jsonString) {
    return jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

export function JParse(query, boolean) {

    if(boolean == true || boolean == undefined || boolean == null) {
        if(typeof query  == "object") return { json: query, isValid: true };
        try {
            const jsonParse = JSON.parse(query);
            return { json: jsonParse, isValid: true };
        }catch {
            return { json: {}, isValid: false };
        }
    } else if(boolean == false) {
        if(typeof query == "object") {
            return { json: JSON.stringify(query), isValid: true };
        } else {
            return {json: {}, isValid: false };
        }
    } else {
        throw new Error("Invalid boolean");
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
                throw new Error("Invalid key. Only key length 16.");
            }
        } else {
            throw new Error("Invalid string.");
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
        if(this.key.length !== 16) throw new Error("The key must be 16 bytes long.");
        const plaintextBytes = this.stringToBytes(plaintext)
        const keyBytes = this.stringToBytes(this.key);
        for(let j = 0; j < 16; j++) plaintextBytes[j] ^= keyBytes[j];
        return this.bytesToHexString(plaintextBytes);
    }

    Decrypt(ciphertext) {
        if(this.key.length !== 16) throw new Error("The key must be 16 bytes long.");
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
