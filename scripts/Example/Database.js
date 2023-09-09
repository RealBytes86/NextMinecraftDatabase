import { NextMDB, CryptoNextMDB  } from "../Libs/NextMDB";

const xor = new CryptoNextMDB().XOR("0100100100110011");
const database = new NextMDB(xor.encrypt("NextMDB"));


database.deleteAndcreate();
database.display.sidebar();