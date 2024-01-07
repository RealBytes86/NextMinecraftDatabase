import { Entity, ScoreboardIdentity, system, world  } from "@minecraft/server"
import "./Example/Database"
import { Base64, NextMDB } from "./Libs/NextMDB";
console.warn("Loading world...");

const setPrefix = ".";

const client = new NextMDB();

const database = client.Scoreboard();
database.deleteAllCollections();
database.createCollection("PlayerID");
const player = database.ClusterCollection("PlayerID");

world.beforeEvents.chatSend.subscribe((ctx) => {
    const messsage = ctx.message;
    if(messsage.startsWith(setPrefix)) {
        ctx.cancel = true;
        const args = messsage.slice(setPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase() 

        if(commandName == "test") {

            //let test = ctx.sender.dimension.getEntitiesAtBlockLocation({x: 0, y: 255, z: 0})
            //console.warn(test.length)

            const data = player.get(7381);

            world.sendMessage(JSON.stringify(data.data, null, 2));

            return;
        } else if(commandName == "test2") {
            player.set(5001, {name: "kevin"})
            return;
        } 

        else if(commandName == "test3") {

            for(let i = 1; i <= 5000; i++) { 
                player.set(i, {name: i});
            }

            
            for(let i = 5000; i <= 10000; i++) { 
                player.set(i, {name: i});
            }

            return;
        } 
        
        
        else if(commandName == "encode") {
            try {
                ctx.sender.sendMessage("Encode: "+ client.Base64().encode(args.join(" ")))
                return;
            } catch{
                ctx.sender.sendMessage("ERROR ENCODE")
                return;
            }
        }

        ctx.sender.sendMessage("§7[§6Command§7]§r §c" + commandName + " not exist.");
    }
})



console.warn("Addon is Ready!");