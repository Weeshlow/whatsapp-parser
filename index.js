const fs = require('fs');
const readline = require('readline');
const Record = require('./record');
const helpers = require('./helpers');
const { linePattern, addRecord } = helpers;

class Whatsapp {

	constructor() {
		this.format = {};
		this.records = null;
	}
	
	/**
	* Set date formatting
	* 
	* @param input {String} - Input format
	* @param output {String} - Output format
	* @return this {Object}
	*/
	format(input, output) {
		this.format.input = input;
		this.format.output = output;
		return this;
	}
	
	timestamp() {
		this.timestamp = true;
	}
	
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
		this.records = [];
		return new Promise((resolve, reject) => {
			this._parseFile(filename, resolve);
		});
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
	
	/**
	* Parse file line by line and generate a records collection
	*
	* @param filename {String} - path to file
	* @param callback {Function} - on complete callback. 
	* The callback is called with the records collection as an argument
	*/	
	_parseFile(filename, resolve) {
		var {records} = this;
		var string;
		//var add = addRecord.bind(null, records, Record);
		
		const rl = readline.createInterface({
		  input: fs.createReadStream(filename, 'utf8')
		});
		rl.on('line', (line) => {;
			//console.log('line', line);
			if (linePattern.test(line)) {
				this._addRecord(string);
				string = line;
			}
			else {
				string += '\n' + line;
			}
		}).on('close', () => {
			this._addRecord(string);
			resolve(records);
		});
	}

	_transform(str) {
		let record = new Record(str);
		var {input, output } = this.format;
		if (input && output) {
			record = record.formatDate(f.input, f.output);
		}
		if (this.timestamp === true) {
			record.date = record.time(output);
		}
		return record;
	}
	
	_addRecord(str) {
		var {records} = this;
		let record = null;
		if (typeof str === 'string' && str.length > 0) {
			record = this._transform(str);
		}
		if (record !== null) {
			records.push(record);
		}
		return records;
	}
}






module.exports = Whatsapp;
