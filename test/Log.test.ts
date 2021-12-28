import { createWriteStream } from 'fs';
import 'jest'
import { Log } from 'Log';
import process, { stderr } from 'process';



describe('Log', () => {
	let log_instance: Log.Utils;
	
	
	beforeEach(() => {

		log_instance = new Log.Utils({
			throw_error: true,
			streams: [
				process.stdout
			]
		})
	});

	test('adding a new stream', () => {
		log_instance.addStreams(process.stderr);
		expect(log_instance.streams.has(stderr)).toEqual(true);
	});

	test('removing a stream', () => {
		log_instance.addStreams(process.stderr);
		log_instance.removeStreams(process.stderr);
		expect(log_instance.streams.size).toEqual(1);
	});
});

