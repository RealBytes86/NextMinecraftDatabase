import { NextMDB, calculateByteSize } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: true});
MDB.init();

MDB.createCollection("Datenbank");
MDB.Display("Datenbank", 1).sidebar();
export const database = MDB.Collection("Datenbank")

