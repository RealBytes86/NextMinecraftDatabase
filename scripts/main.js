import { system, world, ScoreboardIdentity } from "@minecraft/server";
import { NextMDB, SecurityNextMDB } from "./Libs/NextMDB";

const security = new SecurityNextMDB("StayCationPack12");

console.warn("Loading world...");

const setPrefix = ".";
const database = new NextMDB("NextMDB");
database.deleteAndcreate()

world.beforeEvents.chatSend.subscribe((ctx) => {
    const messsage = ctx.message;
    if(messsage.startsWith(setPrefix)) {
        ctx.cancel = true;
        const args = messsage.slice(setPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase() 

        if(commandName == "test1") {
            console.warn()
            return;
        }

        if(commandName == "test2") {

            for(let i = 0; i <= 10000; i++) {
                const names = `ID: ${i}`
                system.run(() => world.scoreboard.getObjective(database.name).setScore(names, i));
            }
        }
    }
})

console.warn("Addon is Ready!");