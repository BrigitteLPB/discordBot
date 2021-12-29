import { createReadStream, createWriteStream } from "fs";
import { Readable, Stream } from "stream";
import { ReadStream, WriteStream } from "tty";
import { Log } from "./Log";

let read = new Readable({
	read: (size)=> {}
});

read.pipe(process.stdout);
read.pipe(process.stderr);

read.push('hello world !\n');