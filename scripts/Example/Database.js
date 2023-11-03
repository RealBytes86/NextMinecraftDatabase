import { world } from "@minecraft/server";
import { NextMDB } from "../Libs/NextMDB";

const client = new NextMDB();

world.afterEvents.worldInitialize.subscribe((ctx) => {
    
})


