import { NextMDB } from "../Libs/NextMDB";

export const database = new NextMDB("Player");

/*
for(let i = 100000; i <= 500000; i++) {
    database.set(i.toString(), {name: i.toString()});
}
*/