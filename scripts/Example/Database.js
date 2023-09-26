import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.developmentMode({notification: true, reloadCollection: true});
const xor = MDB.XOR();
MDB.createCollection()