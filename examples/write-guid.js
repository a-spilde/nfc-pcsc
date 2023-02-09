"use strict";

// #############
// Example from "Reading and writing data" section of project's README
// #############

import { NFC } from '../src/index';

const nfcCard = require('nfccard-tool');


const nfc = new NFC();
const fs = require("fs");
let encryption;

fs.readFile("examples/Encryptions/code.txt", "utf8", (err, data) => {
	if (err) throw err;
	encryption = data.trim();
	console.log("encryption: " + encryption)
});

nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);

	reader.on('card', async card => {

		console.log();
		console.log(`card detected`, card);

		// example write 12 bytes containing text in utf8
		try {

			/**
		 *  1 - READ HEADER
		 *  Read header: we need to verify if we have read and write permissions
		 *               and if prepared message length can fit onto the tag.
		 */
			const cardHeader = await reader.read(0, 20);

			const tag = nfcCard.parseInfo(cardHeader);

			/**
			 * 2 - WRITE A NDEF MESSAGE AND ITS RECORDS
			 */
			const message = [
				{ type: 'text', text: encryption, language: 'en' },
			]

			// Prepare the buffer to write on the card
			const rawDataToWrite = nfcCard.prepareBytesToWrite(message);

			// Write the buffer on the card starting at block 4
			const preparationWrite = await reader.write(4, rawDataToWrite.preparedData);

			// Success !
			if (preparationWrite) {
				console.log('Data have been written successfully.')
				process.exit()
			}

		} catch (err) {
			console.error(`error when writing data`, err);
			process.exit()
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

