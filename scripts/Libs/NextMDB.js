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
            const name = `${this.name}#1`;
            world.scoreboard.addObjective(name, name);
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
        const name = `${this.name}#1`;
        let deleteCount = 0;
        let noDeleteCount = 0;
        try 
        {
            world.scoreboard.removeObjective(name);
            deleteCount += 1;
        } catch 
        {
            noDeleteCount += 1;
        }
        try 
        {
            world.scoreboard.addObjective(name, name);
            deleteCount += 1;
        } catch 
        {
            noDeleteCount += 1;
        }
        return  { response: "reseted",  status: "ok", deleteCount: deleteCount, noDeleteCount: noDeleteCount };
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

    }

    insertDocument(document, json) { 

    }

    updateDocument(document, json) { 

    }

    existsDocument(document) {
        
    }
}

class Docuemnt {

}

class Cluster {
    constructor() {
        this.MAX_DOCUMENT_IN_COLLECTION = 5000;
    }
    
    create() { 
        
    }

    search() {

    }

    save() {

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