import { NextMDB } from "../Libs/NextMDB";

const next = new NextMDB()
next.deleteCollection("database")
next.createCollection("database");
export const database = next.collection("database");

for(let i = 0; i <= 100000; i++) {
    database.insert({hello: i});
}
