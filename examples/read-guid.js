"use strict";

// #############
// Example from "Reading and writing data" section of project's README
// #############

import { NFC } from '../src/index';


const nfc = new NFC();
const blockSize = 4;
const GUID_BLOCK_SIZE = 16





nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);

	reader.on('card', async card => {

		console.log();
		console.log(`card detected`, card);

		// example reading 12 bytes assuming containing text in utf8
		try {

			// reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
			const data = await reader.read(4, GUID_BLOCK_SIZE * blockSize); // starts reading in block 4, continues to 5 and 6 in order to read 12 bytes
			console.log(`data read`, data);
			const payload = data.toString(); // utf8 is default encoding
			console.log(`data converted`, payload);
			process.exit()

		} catch (err) {
			console.error(`error when reading data`, err);
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
