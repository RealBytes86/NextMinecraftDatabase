import { world } from "@minecraft/server";


console.warn("Loading world...");

const setPrefix = ".";

world.beforeEvents.chatSend.subscribe((ctx) => {
    const messsage = ctx.message;
    if(messsage.startsWith(setPrefix)) {
        ctx.cancel = true;
        const args = messsage.slice(setPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase() 

        if(commandName == "test") {
            const data = Array.from(world.scoreboard.getParticipants(), (data) => data.type == "FakePlayer")
            console.warn(data)
            ctx.sender.sendMessage("§aTest Erfolgreich!");
            return;
        }
    }
})

console.warn("Addon is Ready!");