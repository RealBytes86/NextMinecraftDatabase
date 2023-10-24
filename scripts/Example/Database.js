import { NextMDB } from "../Libs/NextMDB";

const next = new NextMDB();
export const database = next.World("database");
database.set("Hello World", {name: "Kevin"});

/*
for(let i = 100000; i <= 500000; i++) {
    database.set(i.toString(), {name: i.toString()});
}
*/