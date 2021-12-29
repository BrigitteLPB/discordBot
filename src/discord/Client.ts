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


	export type EventTypes = Discord.ClientEvents;
	export type EventFunction<K extends keyof EventTypes> = (client: Client.Client, ...args: EventTypes[K]) => Promise<void>;

	export class Event<T extends keyof EventTypes> {
		readonly event: T;
		readonly _run: EventFunction<T>;

		constructor(event: T, fn: EventFunction<T>){
			this.event = event;
			this._run = fn;
		}

		public async run(client: Client, ...args: EventTypes[T]): Promise<void> {
			await this._run(client, ...args);
		}
	}

	// export interface Event<T extends keyof EventTypes> {
	// 	readonly event: T,
	// 	readonly run: EventFunction<T>
	// }

	
	export type ClientEvents = {
		[T in keyof EventTypes]?: Set<Event<T>>;
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

		// protected initEvent<T extends keyof ClientEvents>(envent: T, value: ClientEvents[T]){
		// 	value = new Set();
		// }

		public async run(): Promise<void> {
			await this.login(this.options.token);
		}

		/**
		 * add a new event
		 * @param e 
		 */
		public addEvents<T extends keyof ClientEvents>(e: Event<T>): void;

		/**
		 * add an array of events
		 * @param e 
		 */
		public addEvents<T extends keyof ClientEvents>(e: Event<T>[]): void;

		public addEvents<T extends keyof ClientEvents>(e: Event<T> | Event<T>[]): void {
			if(e instanceof Array){
				for(let event of e){
					this.addEvents(event);
				}
			}else{
				// single event added
				if(!this.events[e.event]){
					console.log(this.events[e.event]);
				}
			}
		}
	}
}


interface TestInterface {
	a: [boolean, string],
	b: [string, number],
}

// type TestInterface = Discord.ClientEvents;

type TestFunction<K extends keyof TestInterface> = (...args: TestInterface[K]) => Promise<void>;

class TestClass<T extends keyof TestInterface>{
	constructor(t: T, ){

	}

	async run(...args: Parameters<TestFunction<T>>){}
}

interface TestClass_<T extends keyof TestInterface>{
	event: T,
	run: (...args: TestInterface[T]) => Promise<void>
}

type TestEvents = {
	[k in keyof TestInterface]?: Set<TestClass<k>>;
}

class TestClass2 {
	readonly test: TestEvents;

	constructor(){
	
		this.test = {};
		for(let key in this.test){
			this.test[key as keyof TestEvents] = new Set();
		}
	}
}