import { NextMDB } from "../Libs/NextMDB";

const next = new NextMDB()
next.deleteCollection("database")
next.createCollection("database");
export const database = next.collection("database");