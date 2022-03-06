import { ClientEvents } from "discord.js";
import { Client } from "./Client";


export type EventTypes = ClientEvents;
export type EventFunction<K extends keyof EventTypes> = (client: Client, ...args: EventTypes[K]) => Promise<void>;

export abstract class BaseEvent{
	readonly event : keyof EventTypes;

	constructor(event : typeof BaseEvent.prototype.event){
		this.event = event;
	}

	public abstract run(client: Client, ...args: EventTypes[keyof EventTypes]): Promise<void>;

}

export class Event<T extends keyof EventTypes> extends BaseEvent {
	readonly event: T;
	protected _run: EventFunction<T>;

	constructor(event: T, fn: EventFunction<T>){
		super(event);
		this.event = event;
		this._run = fn;
	}

	/**
	 * function called when running the event
	 * @param client the bot client
	 * @param args args of the event
	 */
	public async run(client: Client, ...args: EventTypes[T]): Promise<void> {
		await this._run(client, ...args);
	}
}	
