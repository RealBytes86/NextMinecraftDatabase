import { NextMDB } from "../Libs/NextMDB";

const MDB = new NextMDB();
const XOR = MDB.XOR()

const playerid = MDB.Collection("playerid");


MDB.Initialization(true)