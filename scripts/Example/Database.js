import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
const XOR = MDB.XOR();

MDB.developmentMode({notification: true, reloadRegister: false});

MDB.Initialization(true)

const playerid = MDB.Collection("playerid");
