import { world, Entity, MinecraftDimensionTypes, system } from "@minecraft/server";

const CONFIG = {
    location: { x: 0, y: 0, z: 0},
    identifier: "next:database",
    dimension: MinecraftDimensionTypes.overworld,
    init: false,
}

export class NextMDB {

    #isInit = () => {
        if(CONFIG.init == false) {
            throw new Error("Collection is not initialized.");
        }
    }

    constructor () {
        this.utils = {
            JParse,
            escapeQuotes,
            unescapeQuotes,
            calculateByteLength,
        }

        this.beforeInit = {
            setLocationCollection   
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

    StringCollection(database) {
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        return new StringCollection(`STRING:${database}`);
    }

    JSONCollection(database) {
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        return new JSONCollection(`JSON:${database}`);
    }

    existsCollection(database, type = "JSON") {
        this.#isInit();
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        database = `${getType(type)}:${database}`;
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier && collection.nameTag == database) {
                return true;
            }
        }
        return false;
    }

    async createCollection(database, type = "JSON") {
        this.#isInit();
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        database = `${getType(type)}:${database}`;
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier && collection.nameTag == database) {
                return { succes: false }
            }
        }

        const entityDB = dimension.spawnEntity(CONFIG.identifier, CONFIG.location)
        entityDB.nameTag = database

        return { succes: true };
    }

    async resetCollection(database, type = "JSON") {
        this.#isInit();
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        database = `${getType(type)}:${database}`;
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier && collection.nameTag == database) {
                collection.clearDynamicProperties();
                return { succes: true };
            }
        }

        return { succes: false };
    }

    async resetALLCollection() {
        this.#isInit();
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier) {
                collection.clearDynamicProperties();
            }
        }

        return { succes: true };
    }

    async deleteAllCollection() {
        this.#isInit();
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier) {
                collection.clearDynamicProperties();
                collection.triggerEvent("despawn");
            }
        }

        return { succes: true };
    }


    async deleteCollection(database, type = "JSON") {
        this.#isInit();
        if(typeof database != "string" || database.length == 0) throw new Error("Database must be a string.");
        database = `${getType(type)}:${database}`;
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier && collection.nameTag == database) {
                collection.clearDynamicProperties();
                collection.triggerEvent("despawn");
                return { succes: true };
            }
        }

        return { succes: false };
    }

    async initCollection({resetAllCollection = false, deleteAllCollection = false} = {}) {

        if(CONFIG.init) throw new Error("Collection is already initialized.");

        const dimensions = [MinecraftDimensionTypes.overworld, MinecraftDimensionTypes.nether, MinecraftDimensionTypes.theEnd];
        const TICKING_AREA = `tickingarea add circle ${CONFIG.location.x} ${CONFIG.location.y} ${CONFIG.location.z} 3 NEXT:DATABASE`
        const TICKING_AREA_DELETE = "tickingarea remove NEXT:DATABASE";
        let dimension = world.getDimension(CONFIG.dimension);

        for(let i = 0; i < dimensions.length; i++) {
            dimension = world.getDimension(dimensions[i]);
            const tickingArea = await dimension.runCommandAsync(TICKING_AREA);
            if(tickingArea.successCount == 0) {
                const entities = dimension.getEntities();
                for(let e = 0; e < entities.length; e++) {
                    const entity = entities[e];
                    if(entity.typeId == CONFIG.identifier) {
                        const eLocation = entity.location;
                        const getAllCollection = dimension.getEntitiesAtBlockLocation(eLocation);

                        for(let c = 0; c < getAllCollection.length; c++) {
                            const collection = getAllCollection[c];
                            if(collection.typeId == CONFIG.identifier) {
                                if(deleteAllCollection) {
                                    collection.clearDynamicProperties();
                                    collection.triggerEvent("despawn");
                                    continue;
                                } else if(resetAllCollection) {
                                    collection.clearDynamicProperties();
                                }
                                collection.teleport(CONFIG.location, {dimension: dimension});
                            }
                        }
                        break;
                    }
                    break;
                }
                break;
            } else {
                await dimension.runCommandAsync(TICKING_AREA_DELETE);
            }
        }

        await dimension.runCommandAsync(TICKING_AREA_DELETE);
        await dimension.runCommandAsync(TICKING_AREA);
        trySpawnBarrier();

        CONFIG.init = true;
    }

    resetALLWorldData() {
        world.clearDynamicProperties();
        return { succes: true };
    }

    XOR() {
        return new XOR();
    }

    sizeCollection() {
        return world.getDimension(CONFIG.dimension).getEntitiesAtBlockLocation(CONFIG.location).filter((collection) => collection.typeId == CONFIG.identifier).length;
    }
}

class StringCollection {
    constructor(database) {
        this.database = database;
    }

    #collection = (database) => {
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier && collection.nameTag == database) {
                return collection;
            }
        }

        throw new Error("Collection not found.")
    }

    #onChangeCallback = () => {};

    get(property) {
        if(typeof property != "string") throw new Error("property must be a string.");
        const get = this.#collection(this.database).getDynamicProperty(property);
        if(get == undefined) return null;
        this.#onChangeCallback("get", property);
        return get
    }

    set(property, value) {
        if(typeof property != "string") throw new Error("property must be a string.");
        if(typeof value != "string") throw new Error("value must be a string.");
        this.#onChangeCallback("set", property, value);
        this.#collection(this.database).setDynamicProperty(property, value);
        return { succes: true };
    }

    has(property) {
        if(this.#collection(this.database).getDynamicProperty(property)) {
            return true;
        } else {
            return false;
        }
    }

    clear() {
        this.#collection(this.database).clearDynamicProperties();
        return { succes: true };
    }

    size() {
        return this.#collection(this.database).getDynamicPropertyIds().length;
    }

    getByte() {
        return this.#collection(this.database).getDynamicPropertyTotalByteCount();
    }

    delete(property) {
        if(typeof property != "string") throw new Error("property must be a string.");
        this.#onChangeCallback("delete", property);
        this.#collection(this.database).setDynamicProperty(property, undefined);
        return { succes: true };
    }
}

class JSONCollection {

    #collection = (database) => {
        const dimension = world.getDimension(CONFIG.dimension);
        const Collections = dimension.getEntitiesAtBlockLocation(CONFIG.location);
        for(let i = 0; i < Collections.length; i++) {
            const collection = Collections[i];
            if(collection.typeId == CONFIG.identifier && collection.nameTag == database) {
                return collection;
            }
        }

        throw new Error("Collection not found.")
    }

    #onChangeCallback = () => {};

    /**
     * @param {Entity} collection 
     */
    constructor(database) {
        this.database = database;
    }

    get(property) {
        if(typeof property == "string") {
            const get = this.#collection(this.database).getDynamicProperty(property);
            if(get == undefined) return null;
            const J = JParse(unescapeQuotes(get));
            if(J.isValid == false) {
                this.#collection(this.database).setDynamicProperty(get, undefined);
                return { error: "invalid Json" }
            }
            this.#onChangeCallback("get", property)
            return J.json;
        } else {
            throw new Error("property must be a string.");
        }
    }

    has(property) {
        if(this.#collection(this.database).getDynamicProperty(property)) {
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
            this.#collection(this.database).setDynamicProperty(property, escapeQuotes(J.json));
            return { succes: true };
        } else {
            throw new Error("invalid Json.");
        }
    }

    clear() {
        this.#collection(this.database).clearDynamicProperties();
        return { succes: true };
    }

    delete(property) {
        if(typeof property != "string") throw new Error("property must be a string.");
        this.#onChangeCallback("delete", property);
        this.#collection(this.database).setDynamicProperty(property, undefined);
        return { succes: true };
    }

    on(callback) {
        this.#onChangeCallback = callback;
    }

    size() {
        return this.#collection(this.database).getDynamicPropertyIds().length;
    }

    getByte() {
        return this.#collection(this.database).getDynamicPropertyTotalByteCount();
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
                this.entity.setDynamicProperty(get, undefined);
                return { error: "invalid Json" }
            }
            this.#onChangeCallback("get", property)
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
                world.setDynamicProperty(get, undefined);
                return { error: "invalid Json" }
            }
            this.#onChangeCallback("get", property)
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

export class Thread {
    #id = null;
    constructor(func, seconds = 0) {
        this.func = func;
        this.second = seconds;
    }

    start() {
        if(this.#id !== null) throw new Error("Thread is already running.");
        this.#id = system.runInterval(() => this.func, this.second * 20); // Ändern Sie Sekunden in Millisekunden
    }

    stop() {
        if(this.#id === null) throw new Error("Thread is not running.");
        system.clearRun(this.#id);
        this.#id = null;
    }
}


function trySpawnBarrier() {
    const dimension = world.getDimension(CONFIG.dimension);
    try { dimension.fillBlocks(CONFIG.location, CONFIG.location, "minecraft:air"); } catch {}
    try { dimension.fillBlocks({x: CONFIG.location.x, y: CONFIG.location.y - 1, z: CONFIG.location.z}, {x: CONFIG.location.x, y: CONFIG.location.y - 1, z: CONFIG.location.z}, "minecraft:barrier"); } catch {}
    try { dimension.fillBlocks({x: CONFIG.location.x, y: CONFIG.location.y - 1, z: CONFIG.location.z}, {x: CONFIG.location.x, y: CONFIG.location.y - 1, z: CONFIG.location.z}, "minecraft:barrier"); } catch {}
    try { dimension.fillBlocks({x: CONFIG.location.x, y: CONFIG.location.y, z: CONFIG.location.z - 1}, {x: CONFIG.location.x, y: CONFIG.location.y , z: CONFIG.location.z - 1}, "minecraft:barrier"); } catch {}
    try { dimension.fillBlocks({x: CONFIG.location.x - 1, y: CONFIG.location.y, z: CONFIG.location.z}, {x: CONFIG.location.x - 1, y: CONFIG.location.y, z: CONFIG.location.z}, "minecraft:barrier"); } catch {}
    try { dimension.fillBlocks({x: CONFIG.location.x, y: CONFIG.location.y, z: CONFIG.location.z + 1}, {x: CONFIG.location.x, y: CONFIG.location.y, z: CONFIG.location.z + 1}, "minecraft:barrier"); } catch {}
    try { dimension.fillBlocks({x: CONFIG.location.x + 1, y: CONFIG.location.y, z: CONFIG.location.z}, {x: CONFIG.location.x + 1, y: CONFIG.location.y, z: CONFIG.location.z}, "minecraft:barrier"); } catch {}
    try { dimension.fillBlocks({x: CONFIG.location.x, y: CONFIG.location.y + 1, z: CONFIG.location.z}, {x: CONFIG.location.x, y: CONFIG.location.y + 1, z: CONFIG.location.z}, "minecraft:barrier"); } catch {};
    return true;
}

function getType(type = "JSON") {

    if(typeof type != "string") {
        throw new Error("Type must be a string.");
    }

    type = type.toUpperCase();

    if(type == "STRING") {
        return "STRING";
    } else if(type == "JSON") {
        return "JSON";
    } else {
        throw new Error("Type is not supported.");
    }
}

function calculateByteLength(str) {

    if(typeof str != "string") throw new Error("Type must be a string.");

    let length = 0;

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);

        if(charCode <= 0x007F) {} else if (charCode <= 0x07FF) {
            length += 2;
        } else {
            length += 4;
        }

        if(length > 32767) {
            throw new Error('String zu lang');
        }
    }

    return length;
}

function setLocationCollection({x, y, z}, dimension) {

    if(CONFIG.init) throw new Error("Collections have already been initiated.")

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

    CONFIG.location.x = x;
    CONFIG.location.y = y;
    CONFIG.location.z = z;
    CONFIG.dimension = dimension ?? MinecraftDimensionTypes.overworld;

    return { succes: true };
}