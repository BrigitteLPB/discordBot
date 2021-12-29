import * as fs from 'fs'
import { Readable } from 'stream';


export namespace Log {
	export enum Level {
		ERROR = "error",
		WARNING = "warn",
		DEBUG = "debug",
		INFO = "info"	
	}

	export type WriteStream = NodeJS.WriteStream | fs.WriteStream;

	export class Utils extends Readable {
		/**
		 * constructor to Log.Utils
		 * @param options the streams to write
		 */
		constructor(streams: WriteStream[]){
			super({
				read: (size: number) => {}
			});
			
			for(let s of streams){
				this.pipe(s);
			}
		}

		private static zeroFill = function(n: number, zeroFill: number) {
			return ('0'.repeat(zeroFill) + n).slice(-zeroFill);
		}

		/**
		 * generic log function
		 * @param level the type of log [ERROR, WARN, INFO, DEBUG]
		 * @param msgs the logged messages join together without space or return  
		 */
		public async log(level: Log.Level, ...msgs: string[]): Promise<void> {
			const date = new Date();
			const log_day = `${Utils.zeroFill(date.getFullYear(), 4)}-${Utils.zeroFill(date.getUTCMonth(), 2)}-${Utils.zeroFill(date.getUTCDay(), 2)}`;	// create the day string
			const log_msg = `[${level}]	${log_day} ${Utils.zeroFill(date.getUTCHours(),2)}:${Utils.zeroFill(date.getUTCMinutes(),2)}:${Utils.zeroFill(date.getUTCSeconds(),2)}	>	${msgs.join('')}\n`;	// create the log field
	
			this.push(log_msg);
		}

		/**
		 * log a ERROR message
		 * @param msgs 
		 */
		public async logError(...msgs: string[]){
			this.log(Level.ERROR, ...msgs);
		}

		/**
		 * log a DEBUG message
		 * @param msgs 
		 */
		public async logDebug(...msgs: string[]){
			this.log(Level.DEBUG, ...msgs);
		}

		/**
		 * log a WARNING message
		 * @param msgs 
		 */
		public async logWarning(...msgs: string[]){
			this.log(Level.WARNING, ...msgs);
		}

		/**
		 * log an INFO message
		 * @param msgs 
		 */
		public async logInfo(...msgs: string[]){
			this.log(Level.INFO, ...msgs);
		}
	}
}