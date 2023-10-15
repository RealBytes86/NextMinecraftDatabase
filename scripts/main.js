console.warn("Loading world...");

import { system, world } from "@minecraft/server";
import { database } from "./Example/Database";
import "./Example/Database";

const setPrefix = ".";

world.beforeEvents.itemUse.subscribe((ctx) => {

    if(ctx.itemStack.typeId == "minecraft:stick") {
        try {
            const loc = ctx.source.getBlockFromViewDirection();
            if(!loc) return;
            const local = loc.block.location;
            system.run(() => {
                try {
                    ctx.source.dimension.spawnEntity("minecraft:lightning_bolt", {x: local.x, y: local.y + 1, z: local.z})
                    ctx.source.sendMessage("§aLightning successfully");
                } catch {
                    ctx.source.sendMessage("§cLightning failed");
                }
            });
            //system.run(() => ctx.source.teleport({x: local.x, y: local.y + 1, z: local.z}, {dimension: world.getDimension(ctx.source.dimension.id)}))
        
        } catch {}
    }
})


world.beforeEvents.chatSend.subscribe((ctx) => {
    const messsage = ctx.message;
    if(messsage.startsWith(setPrefix)) {
        ctx.cancel = true;
        const args = messsage.slice(setPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase() 

        if(commandName == "test") {
            database.findDocument("5000");
            return;
        }

        if(commandName == "test2") {
            return;
        }

        ctx.sender.sendMessage("§7[§6Command§7]§r §c" + commandName + " not exist.");
    }
})


console.warn("Addon is Ready!");