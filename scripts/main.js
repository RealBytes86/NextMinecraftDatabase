import { world } from "@minecraft/server";

const setPrefix = ".";

world.beforeEvents.chatSend.subscribe((ctx) => {
    const messsage = ctx.message;
    if(messsage.startsWith(setPrefix)) {
        ctx.cancel = true;
        const args = content.slice(setPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase() 

        if(commandName == "test") {
            ctx.sender.sendMessage("§aTest Erfolgreich!");
            return;
        }
    }
})