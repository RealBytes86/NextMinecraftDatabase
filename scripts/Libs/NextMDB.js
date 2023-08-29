import { world } from "@minecraft/server";

class NextMDB {
    /**
     * @param {string} collection 
     */
    constructor(collection) {
        this.name = collection;
        this.collection = new Collection(collection);
    }

    create() {
        if(world.scoreboard.getObjectives().find((scoreboard) => scoreboard.displayName == this.name)) {
            return  { response: "exists",  status: "no" };
        } else {
            world.scoreboard.addObjective(this.name, this.name);
            return { response: "created",  status: "ok" };
        }
    }

    delete() {
        if(world.scoreboard.getObjectives().find((scoreboard) => scoreboard.displayName == this.name)) {
            world.scoreboard.removeObjective(this.name);
            return  { response: "exists",  status: "ok" };
        } else {
            return { response: "no exists",  status: "no" };
        }
    }

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
                noDeleteCount ++;
            }
            try 
            {
                world.scoreboard.addObjective(this.name, this.name);
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

    insertDocument() { 

    }

    existsDocument() {

    }
}

/**
 * @param {String} jsonString 
 * @returns {Object}
 */
function getJson(jsonString) {
    try {
        const jsonParse = JSON.parse(jsonString);
        return { json: jsonParse,}
    }catch {
        return { json: null }
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