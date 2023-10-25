import { NextMDB } from "../Libs/NextMDB";

const client = new NextMDB();
client.setLocationCollection({x: 0, y: -61, z: 0});
client.initCollection()