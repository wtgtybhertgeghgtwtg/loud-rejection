'use strict';
const util = require('util');
const onExit = require('signal-exit');
const currentlyUnhandled = require('currently-unhandled');

let installed = false;

module.exports = (log = console.error) => {
	if (installed) {
		return;
	}
	installed = true;

	const listUnhandled = currentlyUnhandled();

	onExit(() => {
		const unhandledRejections = listUnhandled();

		if (unhandledRejections.length > 0) {
			for (const unhandledRejection of unhandledRejections) {
				let error = unhandledRejection.reason;

				if (!(error instanceof Error)) {
					error = new Error(`Promise rejected with value: ${util.inspect(error)}`);
				}

				log(error.stack);
			}

			process.exitCode = 1;
		}
	});
};
