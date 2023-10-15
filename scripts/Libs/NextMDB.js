import { world } from "@minecraft/server";

const score_begin = -1000000000;

export class MinecraftDB {

    collection(collection) {
        return new collections(collection);
    }

    createCollection(collection) {
        const scoreboards = world.scoreboard.getObjectives();

        for(let i = 0; i < scoreboards.length; i++) {
            const scoreboard = scoreboards[i];
            if(scoreboard.displayName == collection) {
                return null;
            }
        }

        return world.scoreboard.addObjective(collection, collection);
    }

    deleteCollection(collection) {

        const scoreboards = world.scoreboard.getObjectives();

        for(let i = 0; i < scoreboards.length; i++) {
            const scoreboard = scoreboards[i];
            if(scoreboard.displayName == collection) {
                return world.scoreboard.removeObjective(collection);
            }
        }

        return null;
    }
}


class document {

    constructor(participant, scoreboard, JSON_) {
        this.participant = participant;
        this.scoreboard = scoreboard;
        this.JSON = JSON_;
    }

    delete() {
        world.getDimension("overworld").runCommand(`scoreboard players reset "${this.participant.displayName}" ${this.scoreboard.displayName}`)
        return 1;
    }

    output() {
        console.warn(JSON.stringify(this.JSON[0]));
        return 1;
    }

    update(query) {
        world.getDimension("overworld").runCommand(`scoreboard players reset "${this.participant.displayName}" ${this.scoreboard.displayName}`)
        world.getDimension("overworld").runCommand(`scoreboard players set "${escapeQuotes(JSON.stringify([query]))}" ${this.scoreboard.displayName} 0`)
        return 1;
    }
}

class collections {

    constructor(collection) {
        this.collection = collection;
    }
    findOne(query) {
        const scoreboard = world.scoreboard.getObjective(this.collection);
        const participants = scoreboard.getParticipants();
        
        for(let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            const unscape = unescapeQuotes(participant.displayName)
            if(isJSONObject(unscape)) {
                const JSON_OBJECT = JSON.parse(unscape);
                if(find(JSON_OBJECT, query)) {
                    return {
                        json: JSON_OBJECT[0],
                        document: new document(participant, scoreboard, JSON_OBJECT)
                    }
                }
            }
        }

        return null;
    }

    deleteOne(query) {

        const participants = world.scoreboard.getObjective(this.collection).getParticipants();
        
        for(let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            const unscape = unescapeQuotes(participant.displayName)
            if(isJSONObject(unscape)) {
                const JSON_OBJECT = JSON.parse(unscape);
                if(find(JSON_OBJECT, query)) {
                   world.getDimension("overworld").runCommand(`scoreboard players reset "${participant.displayName}" ${this.collection}`)
                   return 1;
                }
            }
        }

        return null;
    }

    insertOne(json) {
        world.getDimension("overworld").runCommand(`scoreboard players set "${escapeQuotes(JSON.stringify([json]))}" ${this.collection} 0`)
        return 1;
    }

}

function escapeQuotes(jsonString) {
    return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function unescapeQuotes(jsonString) {
    return jsonString.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function isJSONObject(value) {
    if (typeof value !== "string") {
        return false;
    }

    try {
        JSON.parse(value);
        return true;
    } catch (error) {
        return false;
    }
}
  
function find(array, query) {
    for (let i = 0; i < array.length; i++) {
        const obj = array[i];
        if (isMatch(obj, query)) {
            return obj;
        }
    }
    return null;
}

function isMatch(obj, query) {
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            const queryValue = query[key];
            const objValue = obj[key];
            if (typeof queryValue === 'object') {
                if (Array.isArray(queryValue)) {
                    if (!isArrayMatch(objValue, queryValue)) {
                        return false;
                    }
                } else {
                    if (!isMatch(objValue, queryValue)) {
                        return false;
                    }
                }
            } else {
                if (objValue !== queryValue) {
                    return false;
                }
            }
        }
    }
    return true;
}

function isArrayMatch(objArray, queryArray) {
    if (!Array.isArray(objArray)) {
        return false;
    }
    for (let i = 0; i < queryArray.length; i++) {
        const queryObj = queryArray[i];
        let found = false;
        for (let j = 0; j < objArray.length; j++) {
            const obj = objArray[j];
            if (isMatch(obj, queryObj)) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}