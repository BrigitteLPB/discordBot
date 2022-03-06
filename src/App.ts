import { DISCORD, LOG, logUtil } from "src/Constants";
import * as fs from 'fs'
import { Message } from "discord.js";
import { Client, Event } from "./Bot";


fs.mkdir(LOG.PATH, () => {
	logUtil.logInfo("hello world !");
});


let client = new Client({
	intents: [
		"GUILDS",
		"GUILD_MESSAGES"

	],
	token: DISCORD.TOKEN
});

client.addEvents(new Event('messageCreate', async (client, msg) => {
	if(!msg.author.bot){
		msg.reply("hello world !");
	}
}));

client.run();