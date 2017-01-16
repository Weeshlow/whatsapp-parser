const fs = require('fs');
const lineParser = require('./line-parser');
const Record = require('./record');
const helpers = require('./helpers');
const { linePattern, streamify, getReadable } = helpers;

class Whatsapp {

	constructor() {
		this._format = {};
		this._multiline = false;
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
		this._format.input = input;
		this._format.output = output;
		return this;
	}
	
	/**
	* Set date property as Date object (or Date object wrapper) on record
	* @param value {Boolean} true if record date should be an object, false otherwise
	* @return this instance {Object}
	*/
	timestamp(value=true) {
		this._timestamp = value;
		return this;
	}
	
	/**
	* Set single or multi line mode
	* @param value {Boolean} true if multi-line mode or false otherwise
	* @return this instance {Object}
	*/
	multiline(value=true) {
		this._multiline = value;
		return this;
	}
	
	/**
	* Parse String or String array to a collection of whatsapp records
	* 
	* @param stringOrArray {String/Array} - Text or array of records to parse
	* @return promise {Promise} - resolved with records collection
	*/	
	parse(stringOrArray) {
		return this._parse(getReadable(stringOrArray))
	}
	
	/**
	* Parse whatsapp text file to collection of whatsapp records
	*
	* @param filename {String} - Path to file
	* @return promise {Promise} - resolved with records collection
	*/
	parseFile(filename) {
		return this._parse(getReadable(filename, true));
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
	* Parse readable stream to a collection of whatsapp records
	*
	* go line by line
	* if does not start with a record pattern add to existing record
	* if starts with record pattern - save existing record and start a new record
	* @param inputStream {Stream} - Readable stream
	* @return promise {Promise} - resolved with records collection
	*/
	_parse(inputStream) {
		var records = [];
		return new Promise((resolve, reject) => {
			var string = '';
			var onLine = (line) => {
				var match = linePattern.test(line);
				if (this._multiline) {
					if (match) {
						this._addRecord(string, records);
						string = line;
					}
					else {
						string += '\n' + line;
					}
				}
				else if (match) {
					this._addRecord(line, records);
				}
			}
			var onClose = () => {
				if (this._multiline) {
					this._addRecord(string, records);
				}
				resolve(records);
			}

			lineParser(inputStream, onLine, onClose);
		});
	}
	
	// create record and apply transformations before returning it.
	_transform(str) {
		let record = new Record(str);
		var {input, output } = this._format;
		if (input && output) {
			record = record.formatDate(input, output);
		}
		if (this._timestamp === true && (output || input)) {
			record.date = record.time((output || input));
		}
		return record;
	}
	
	// add record to list. return list
	_addRecord(str, records) {
		let record = null;
		if (str.length > 0) {
			record = this._transform(str);
		}
		if (record !== null) {
			records.push(record);
		}
		return records;
	}
}

module.exports = Whatsapp;
