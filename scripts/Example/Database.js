import { NextMDB } from "../Libs/NextMDB";

const next = new NextMDB()
next.deleteCollection("database")
next.createCollection("database");
export const database = next.collection("database");

for(let i = 0; i <= 250000; i++) {
    database.insert({i: i});
}
