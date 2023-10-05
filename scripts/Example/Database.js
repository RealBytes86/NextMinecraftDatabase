import { NextMDB, calculateByteSize } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: false});
const xor = MDB.XOR();
MDB.init();

MDB.createCollection("Datenbank");
MDB.Display("Datenbank", 0).sidebar();
const database = MDB.Collection("Datenbank")
database.insertDocument("HelloWorld", {name: "kevin"})