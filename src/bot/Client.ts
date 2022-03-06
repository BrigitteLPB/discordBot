import * as Discord from 'discord.js'
import { BaseEvent, Event, EventTypes } from './Event';



export interface ClientOptions extends Discord.ClientOptions {
	token: string
}

type ClientEvents = {
	[T in keyof EventTypes]?: Set<BaseEvent>;
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
	}

	/**
	 * initilize the event
	 * @param event_name	event name
	 */
	private initEvent(event_name: keyof ClientEvents) {		
		this.events[event_name] = new Set<BaseEvent>();	

		this.on(event_name, (...args) => {
			for(let event of this.events[event_name] as Set<BaseEvent>){
				event.run(this, ...args);	// no await for parallel operations
			}
		});
	}

	/**
	 * lauching the bot
	 */
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
			if (this.events[e.event] == undefined) {
				this.initEvent(e.event);
			}

			this.events[e.event]?.add(e);
		}
	}
}
