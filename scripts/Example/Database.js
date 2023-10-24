import { NextMDB } from "../Libs/NextMDB";

const next = new NextMDB();
export const database = next.World("database");
