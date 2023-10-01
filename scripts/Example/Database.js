import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: false});
MDB.init();

