import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: true});
MDB.Initialization(true)

MDB.createCollection("TEST");
