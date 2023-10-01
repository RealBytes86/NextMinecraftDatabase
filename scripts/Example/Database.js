import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
const xor = MDB.XOR();
MDB.developmentMode({notification: true, reloadCollection: true});
MDB.init();


MDB.createCollection()