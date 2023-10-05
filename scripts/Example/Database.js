import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: false});
const xor = MDB.XOR();
MDB.init();

MDB.createCollection("Datenbank");
const database = MDB.Collection("Datenbank");
database.insertDocument("HelloWorld", {name: "Kevin"})