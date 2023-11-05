import { world } from "@minecraft/server";
import { NextMDB } from "../Libs/NextMDB";

const client = new NextMDB();

world.afterEvents.worldInitialize.subscribe((ctx) => {
    client.beforInit.setLocationCollection({x: 0, y: 40, z: 0});
    client.initCollection().then(() => {
        client.createCollection("Hello World")
        client.createCollection("Hello World1")
        client.createCollection("Hello World2")
        client.createCollection("Hello World3")
        client.createCollection("Hello World4")
        client.createCollection("Hello World5")
    })
})


