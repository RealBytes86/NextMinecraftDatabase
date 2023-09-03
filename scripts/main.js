import { system, world } from "@minecraft/server";
import { NextMDB, CryptoNextMDB } from "./Libs/NextMDB";

const security = new CryptoNextMDB();
const XOR = security.XOR("2828282828282318");

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