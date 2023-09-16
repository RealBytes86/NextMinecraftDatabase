import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
MDB.Initialization(true)

const XOR = MDB.XOR()
const playerid = MDB.Collection("playerid");
