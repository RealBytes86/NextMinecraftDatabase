import { world } from "@minecraft/server"
import "./Example/Database";

console.warn("Loading world...");

const setPrefix = ".";

world.beforeEvents.chatSend.subscribe((ctx) => {
    const messsage = ctx.message;
    if(messsage.startsWith(setPrefix)) {
        ctx.cancel = true;
        const args = messsage.slice(setPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase() 

        if(commandName == "test") {
            return;
        }

        ctx.sender.sendMessage("§7[§6Command§7]§r §c" + commandName + " not exist.");
    }
})


console.warn("Addon is Ready!");