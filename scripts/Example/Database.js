import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB("root", "admin");
const XOR = MDB.XOR();
MDB.developmentMode({notification: true, reloadRegister: true});
MDB.Initialization(true)

MDB.createCollection("playerid");
