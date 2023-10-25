import { world } from "@minecraft/server";
import { NextMDB } from "../Libs/NextMDB";

const client = new NextMDB();

world.afterEvents.worldInitialize.subscribe((ctx) => {
    client.setLocationCollection({x: 0, y: -61, z: 0});
    client.initCollection()
    client.createCollection("database");
    client.createCollection("hello");
})


