import { NextMDB, calculateByteSize } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: false});
const xor = MDB.XOR();
MDB.init();

MDB.createCollection("Datenbank");
//MDB.Display("Datenbank", 0).sidebar();
export const database = MDB.Collection("Datenbank")

/*
for(let i = 0; i <= 10001; i++) {
    database.insertDocument(`TEST: ${i}`, {name: i});
}
*/

