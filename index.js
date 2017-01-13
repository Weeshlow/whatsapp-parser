const fs = require('fs');
const readline = require('readline');
const Record = require('./record');
const helpers = require('./helpers');
const { linePattern, addRecord } = helpers;

class Whatsapp {
	/**
	* Parse whatsapp text file to collection of whatsapp records
	* 
	* go line by line
	* if does not start with a record pattern add to existing record
	* if starts with record pattern - save existing record and start a new record
	* @param filename {String} - The text file path
	* @return promise {Promise} - resolved with records collectio
	*/
	parse(filename) {
		let resolve, reject;
		const promise = new Promise((_resolve, _reject) => {
			resolve = _resolve;
			reject  = _reject;
		});
		
		fs.stat(filename, (err, stat) => {
			if (err) {
				reject(err);
			}
			else if (stat.isFile()) {
				parseFile(filename, resolve);
			} 
			else {
				reject(`Error: File ${filename} not found`); 
			}
		});
		
		return promise;
	}
	
	/**
	* Write records as comma separated values file
	*
	* @param records {Array} - Records collection
	* @param filename {String} - path of output file
	* @param encoding {String} - encoding to use when writing to file
	* @return promise {Promise} - resolved when file is written or rejected on error
	*/	
	toCSV(records, filename, encoding='utf8') {
		var headers = Record.defaultFields.map(item => item.name);
		var outputs = Record.defaultFields.map(item => item.output);
		
		var data = records.map((rec) => rec.toCSV(outputs));
		data.unshift(headers.join(','));
		data = data.join('\n');
		return new Promise((resolve, reject) => {
			fs.writeFile(filename, data, encoding, (err) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}
}

/**
* Parse file line by line and generate a records collection
*
* @param filename {String} - path to file
* @param callback {Function} - on complete callback. 
* The callback is called with the records collection as an argument
*/
function parseFile(filename, resolve) {
	var records = [];
	var string;
	var add = addRecord.bind(null, records, Record);
	
	const rl = readline.createInterface({
	  input: fs.createReadStream(filename, 'utf8')
	});
	rl.on('line', (line) => {;
		//console.log('line', line);
		if (linePattern.test(line)) {
			add(string);
			string = line;
		}
		else {
			string += '\n' + line;
		}
	}).on('close', () => {
		add(string);
		resolve(records);
	});
}

module.exports = Whatsapp;
