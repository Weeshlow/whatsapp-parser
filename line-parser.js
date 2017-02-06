const readline = require('readline');	
	
function lineParser(inputStream, onLine, onClose) {
	const rl = readline.createInterface({
	  input: inputStream
	});
	rl.on('line', onLine)
		.on('close', onClose);
	
	return rl;
}

module.exports = lineParser;
