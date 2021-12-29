import { DISCORD, LOG, logUtil } from "src/Constants";
import * as fs from 'fs'
import { Client } from "./discord/Client";
import { Event } from "./discord/Event";

fs.mkdir(LOG.PATH, () => {
	logUtil.logInfo("hello world !");
});


let client = new Client.Client({
	intents: [
		"GUILD_MESSAGES"
	],
	token: DISCORD.TOKEN
});



client.addEvents(new Event.Event('messageCreate', async (client, msg) => {
	msg.reply("hello world !");
}));