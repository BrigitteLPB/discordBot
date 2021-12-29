import * as fs from "fs";
import { Log } from "src/Log"

export const LOG = {
	PATH: `${process.env['NODE_PATH']}\\log`
}

export const logUtil = new Log.Utils([
	process.stdout,
	fs.createWriteStream(`${LOG.PATH}/.log`, {
		encoding: 'utf-8',
		flags: 'as'
	})
]);


export const DISCORD = {
	TOKEN : process.env['DISCORD_TOKEN'] ?? ""
}