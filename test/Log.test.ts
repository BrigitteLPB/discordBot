import { createWriteStream, fstat, read, readFileSync, WriteStream } from 'fs';
import 'jest'
import { Log } from 'src/Log';
import process, { stderr } from 'process';



describe('Log', () => {
	let log_instance: Log.Utils;
	
	
	beforeEach(() => {

		log_instance = new Log.Utils([
				process.stdout
		]);

	});

	test('write in file', () => {
		let path = process.env['NODE_PATH'] + '/.log';
		let str = 'hello world !';

		let file = createWriteStream(path, {
			flags: 'w' 
		});

		file.on('open', () => {
			log_instance.pipe(file);
			log_instance.log(Log.Level.INFO, str);
			
			let read_file = readFileSync(path);
			
			expect(read_file.slice("[info]	####-##-## ##:##:##	>	".length, read_file.length-1).toString()).toEqual(str);		});
	});
});

