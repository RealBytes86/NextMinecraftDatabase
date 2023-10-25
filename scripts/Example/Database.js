import { NextMDB } from "../Libs/NextMDB";

const client = new NextMDB();
client.setLocationCollection({x: 0, y: -61, z: 0});
client.initCollection()
client.createCollection("database");
client.createCollection("hello");
const database = client.Collection("database");
const hell = client.Collection("hello");
hell.set("hello", {id: 1});
database.set("Hello World", {name: "kevin"});