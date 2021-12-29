import * as Discord from 'discord.js'
import { Event } from './Event';



let client = new Discord.Client({
	intents: [
		'DIRECT_MESSAGES'
	]	
});


export namespace Client {

	export interface ClientOptions extends Discord.ClientOptions {
		token: string
	}

	export type ClientEvents = {
		[k in keyof Event.EventTypes]?: Set<Event.Event<k>>;
	}

	/**
	 * this class abtract the gestion of the events
	 */
	export class Client extends Discord.Client {
		readonly options: ClientOptions;
		readonly events: ClientEvents;

		constructor(options: ClientOptions){
			super(options);
			this.options = options;

			this.events = {};
			for(let key in this.events){
				this.events[key as keyof ClientEvents] = new Set();
			}
		}

		public async run(): Promise<void> {
			await this.login(this.options.token);
		}

		/**
		 * add a new event
		 * @param e 
		 */
		public addEvents<T extends keyof ClientEvents>(e: Event.Event<T>): void;

		/**
		 * add an array of events
		 * @param e 
		 */
		public addEvents<T extends keyof ClientEvents>(e: Event.Event<T>[]): void;

		public addEvents<T extends keyof ClientEvents>(e: Event.Event<T> | Event.Event<T>[]): void {
			if(e instanceof Array){
				for(let event of e){
					this.addEvents(event);
				}
			}else{
				// single event added
				if(!this.events[e.event]){
					this.events[e.event];
				}
			}
		}
	}
}