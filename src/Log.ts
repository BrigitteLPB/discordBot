import * as fs from 'fs'
import { start } from 'repl';


export namespace Log {
	export enum Level {
		ERROR = "error",
		WARNING = "warn",
		DEBUG = "debug",
		INFO = "info"	
	}

	export type WriteStream = NodeJS.WriteStream;
	
	export class WriteStreamNotFound extends Error {
		constructor(stream: WriteStream){
			super(`<${stream}> WriteStream does not exist in the list (remove)`);
		}
	}

	export class WriteStreamAlreadyExists extends Error {
		constructor(stream: WriteStream){
			super(`the <${stream}> WriteStream already exist in the list (add)`);
		}
	}

	export class Utils {
		readonly streams: Set<WriteStream>;
		readonly throw_errors: boolean;
	
		/**
		 * constructor to Log.Utils
		 * @param options the streams to write
		 */
		constructor(options: {
			streams: WriteStream[]
			throw_error?: boolean,
		}){
			this.streams = new Set();
			this.addStreams(options.streams);
			this.throw_errors = options.throw_error ?? false;
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
			for(let stream of this.streams){

				const date = new Date();
				const log_day = `${Utils.zeroFill(date.getFullYear(), 4)}-${Utils.zeroFill(date.getUTCMonth(), 2)}-${Utils.zeroFill(date.getUTCDay(), 2)}`;	// create the day string
				const log_msg = `[${level}]	${log_day} ${Utils.zeroFill(date.getUTCHours(),2)}:${Utils.zeroFill(date.getUTCMinutes(),2)}:${Utils.zeroFill(date.getUTCSeconds(),2)}	>	${msgs.join('')}`;	// create the log field
		
				await new Promise<void>((resolve, reject) => {
					stream.write(log_msg, (error) => {
						if(error) reject(error);
						resolve();
					});
				}).then(() => {
					return;
				}).catch((error: Error) => {
					throw error;
				});
			}
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
		
		/**
		 * add a new stream to the object, path must be different
		 * @param stream the stream to add
		 * @err thorw a WriteStreamAlreadyExists if the stream is already added and throw_error is true
		 */
		public addStreams(stream: WriteStream): void;
		
		/**
		 * add multiple streams
		 * @param streams array of streams
		 * @err thorw a WriteStreamAlreadyExists if the stream is already added and throw_error is true
		 */
		public addStreams(streams: WriteStream[]): void;

		public addStreams(s: WriteStream|WriteStream[]): void{
			if(s instanceof Array){
				for(let stream of s){
					this.addStreams(stream);
				}
			}else{
				if(!this.streams.has(s)){
					this.streams.add(s);
					s.addListener('close', () => {
						this.removeStreams(s);
					});
				}else{
					if(this.throw_errors){
						throw new WriteStreamAlreadyExists(s);
					}
				}
			}
		}
	

		/**
		 * remove the specitific stream with his path
		 * @param stream 
		 * @err throws a WriteStreamNotFound error if throw_errors and the WriteStream is not found
		 */
		public removeStreams(stream: WriteStream): void;
		
		
		/**
		 * remove multiple streams
		 * @param streams array of streams
		 * @err throws a WriteStreamNotFound error if throw_errors and the WriteStream is not found
		 */
		public removeStreams(streams: WriteStream[]): void;
		
		public removeStreams(s: WriteStream|WriteStream[]): void {
			if(s instanceof Array){
				for(let stream of s){
					this.removeStreams(s);
				}
			}else{
				if(this.streams.has(s)){
					this.streams.delete(s);
				}else{
					if(this.throw_errors){
						throw new WriteStreamNotFound(s);
					}
				}
			}
		}
	}
}