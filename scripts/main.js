import { system, world, ScoreboardIdentity } from "@minecraft/server";
import { NextMDB } from "./Libs/NextMDB";


console.warn("Loading world...");

const setPrefix = ".";
const database = new NextMDB("NextMDB");
database.deleteAndcreate()
database.display.sidebar();
world.beforeEvents.chatSend.subscribe((ctx) => {
    const messsage = ctx.message;
    if(messsage.startsWith(setPrefix)) {
        ctx.cancel = true;
        const args = messsage.slice(setPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase() 

        if(commandName == "test1") {
            const participants = world.scoreboard.getParticipants();
            const data = Array.from(participants, {length: 5000}, (_, index) => participants[index].displayName); 
            console.warn(data)
            return;
        }

        if(commandName == "test2") {

            for(let i = 0; i <= 5000; i++) {
                const names = `ID: ${i}`
                system.run(() => world.scoreboard.getObjective("NextMDB#1").setScore(names, i));
            }
        }
    }
})

console.warn("Addon is Ready!");