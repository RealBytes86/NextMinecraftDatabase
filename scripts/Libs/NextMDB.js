import { world } from "@minecraft/server";

const cache = [];

export class NextMDB {
    /**
     * @param {string} collection 
     */
    constructor(collection) {
        this.name = collection;
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
    reset() {
        if(world.scoreboard.getObjectives().find((scoreboard) => scoreboard.displayName == this.name)) {
            let deleteCount = 0;
            let noDeleteCount = 0;
            try 
            {
                world.scoreboard.removeObjective(this.name);
                deleteCount++;
            } catch 
            {
                noDeleteCount++;
            }
            try 
            {
                const name = `${this.name}#1`;
                world.scoreboard.addObjective(name, name);
                deleteCount++;
            } catch 
            {
                noDeleteCount++;
            }
            return  { response: "reseted",  status: "ok", deleteCount: deleteCount, noDeleteCount: noDeleteCount };
        } else {
            return { response: "no exists",  status: "no", deleteCount: null, noDeleteCount: null };
        }
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

    existsDocument(document) {
        
    }
}

function search() {
    
}

function dataCluster() {
    const MAX_DOCUMENT_IN_COLLECTION = 5000;
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