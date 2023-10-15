import { NextMDB, calculateByteSize } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: true});
MDB.init();

MDB.createCollection("Datenbank");
const display = MDB.Display("Datenbank", 1);
display.sidebar();
export const database = MDB.Collection("Datenbank")
database.findDocument("lol");
