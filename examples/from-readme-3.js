"use strict";

// #############
// Example from "Reading and writing data" section of project's README
// #############

import { NFC } from '../src/index';


const nfc = new NFC();
const fs = require("fs");
const blockSize = 4;

let guid;

fs.readFile("examples/Encryptions/code.txt", "utf8", (err, data) => {
	if (err) throw err;
	guid = data.trim();
	console.log("guid: " + guid)
});




nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);

	reader.on('card', async card => {

		console.log();
		console.log(`card detected`, card);
		const numBlocks = Math.ceil((Buffer.from(guid).length) / blockSize);
		console.log(`numBlocks`, numBlocks);

		// example reading 12 bytes assuming containing text in utf8
		try {

			// reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
			const data = await reader.read(4, numBlocks * blockSize); // starts reading in block 4, continues to 5 and 6 in order to read 12 bytes
			console.log(`data read`, data);
			const payload = data.toString(); // utf8 is default encoding
			console.log(`data converted`, payload);

		} catch (err) {
			console.error(`error when reading data`, err);
		}

		// example write 12 bytes containing text in utf8
		try {

			// Determine the block size of the tag
			

			// Calculate the number of blocks needed to store "hi mom"
			

			// Allocate a buffer to store the data with the appropriate size
			const data = Buffer.allocUnsafe(numBlocks * blockSize).fill(0);

			// Write "hi mom" to the data buffer
			data.write(guid);

			// Write the data to the tag, starting from block 4
			await reader.write(4, data);




			//const data = Buffer.allocUnsafe(numBlocks);
			//data.fill(0);
			//const text = (new Date()).toTimeString();
			//data.write(text); // if text is longer than 12 bytes, it will be cut off
			// reader.write(blockNumber, data, blockSize = 4)
			//await reader.write(4, data); // starts writing in block 4, continues to 5 and 6 in order to write 12 bytes
			console.log(`data written`);

		} catch (err) {
			console.error(`error when writing data`, err);
		}

	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});
