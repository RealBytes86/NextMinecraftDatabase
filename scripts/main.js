console.warn("Loading world...");

import { system, world } from "@minecraft/server";
import { NextMDB, NextMap } from "./Libs/NextMDB";
import "./Example/Database";

const next = new NextMDB();
const xor = next.XOR();

const setPrefix = ".";

world.beforeEvents.itemUse.subscribe((ctx) => {

    if(ctx.itemStack.typeId == "minecraft:stick") {
        try {
            const loc = ctx.source.getBlockFromViewDirection();
            if(!loc) return;
            const local = loc.block.location;
            system.run(() => ctx.source.dimension.spawnEntity("minecraft:lightning_bolt", {x: local.x, y: local.y + 1, z: local.z}));
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
            return;
        }

        if(commandName == "test2") {
        }
    }
})


console.warn("Addon is Ready!");