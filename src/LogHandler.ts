import * as fs from 'fs';
import { LOG } from "./Constants";

export enum LogState {
	ERROR = "error",
	WARNING = "warn",
	DEBUG = "debug",
	INFO = "info"
}

const zeroFill = function(n: number, zeroFill: number) {
    return ('0'.repeat(zeroFill) + n).slice(-zeroFill);
}

export class LogHandler {
	static log(state: LogState, msg: string){
		const date = new Date();
		const log_day = `${zeroFill(date.getFullYear(), 4)}-${zeroFill(date.getUTCMonth(), 2)}-${zeroFill(date.getUTCDay(), 2)}`;	// create the day string
		const log_msg = `[${state}]	${log_day} ${zeroFill(date.getUTCHours(),2)}:${zeroFill(date.getUTCMinutes(),2)}:${zeroFill(date.getUTCSeconds(),2)}	>	${msg}`;	// create the log field
		
		if(LOG.PATH && typeof LOG.PATH == "string"){	// log in file if we found a path
			if(!fs.existsSync(LOG.PATH)){
				fs.mkdirSync(LOG.PATH);
			}

			const log_filename = `${LOG.PATH}\\${log_day}.log`;

			if(!fs.existsSync(log_filename)){
				fs.writeFileSync(log_filename, `${log_msg}\n`);
			}else{
				fs.appendFileSync(log_filename, `${log_msg}\n`);
			}
		}

		console.log(log_msg);
	}

	static logError(msg: string){
		LogHandler.log(LogState.ERROR, msg);
	}
	static logWarn(msg: string){
		LogHandler.log(LogState.WARNING, msg);
	}
	static logDebug(msg: string){
		LogHandler.log(LogState.DEBUG, msg);
	}
	static logInfo(msg: string){
		LogHandler.log(LogState.INFO, msg);
	}
}