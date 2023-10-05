import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: true});
const xor = MDB.XOR();
MDB.init();

MDB.createCollection("Datenbank");
const database = MDB.Collection("Datenbank");

for(let i = 0; i <= 5000; i++) {
    database.insertDocument("HelloWorld", {name: "Kevin"})
}