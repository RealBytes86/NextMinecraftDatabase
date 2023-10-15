import { NextMDB } from "../Libs/NextMDB";

const next = new NextMDB()
next.deleteCollection("database")
next.createCollection("database");
const database = next.collection("database");

for(let i = 0; i <= 5000; i++) {
    database.insert(i);
}