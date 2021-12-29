import * as Discord from 'discord.js'
import { Client } from './Client';


export namespace Event {

	export type EventTypes = Discord.ClientEvents;
	export type EventFunction<K extends keyof EventTypes> = (client: Client.Client, ...args: EventTypes[K]) => Promise<void>;

	export class Event<K extends keyof EventTypes> {
		readonly event: K;
		readonly fn: EventFunction<K>;

		constructor(event: K, fn: EventFunction<K>){
			this.event = event;
			this.fn = fn;
		}

		public async run(client: Client.Client, ...args: EventTypes[K]): Promise<void> {
			await this.fn(client, ...args);
		}
	}
}
