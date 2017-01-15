const fs = require('fs');
const lineParser = require('./line-parser');
const Record = require('./record');
const helpers = require('./helpers');
const { linePattern, streamify } = helpers;

class Whatsapp {

	constructor() {
		this._format = {};
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
	
	timestamp() {
		this._timestamp = true;
		return this;
	}
	
	/**
	* Parse String or String array to a collection of whatsapp records
	* 
	* @param stringOrArray {String/Array} - Text or array of records to parse
	* @return promise {Promise} - resolved with records collection
	*/	
	parse(stringOrArray) {
		return this._parse(this._getReadable(stringOrArray))
	}
	
	/**
	* Parse whatsapp text file to collection of whatsapp records
	*
	* @param filename {String} - Path to file
	* @return promise {Promise} - resolved with records collection
	*/
	parseFile(filename) {
		return this._parse(this._getReadable(filename, true));
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
		var records = this.records = [];
		return new Promise((resolve, reject) => {
			var string;
			var onLine = (line) => {
				if (linePattern.test(line)) {
					this._addRecord(string);
					string = line;
				}
				else {
					string += '\n' + line;
				}
			}
			var onClose = () => {
				this._addRecord(string);
				resolve(records);
			}

			lineParser(inputStream, onLine, onClose);
		});
	}
	
	/**
	* Get Readable stream from input value
	* The value can be a path to a file, string, array of strings.
	*
	* @param value {mixed} - value to create Readable stream from.
	* @param isFile {Boolean} - true to indicate value is a path
	* @return readable stream {Stream}
	*/
	_getReadable(value, isFile=false) {
		switch(true) {
			case (isFile): return fs.createReadStream(value, 'utf8');
			case (typeof value === 'string'): return streamify(value);
			case (Array.isArray(value)): return this.getReadable(value.join('\n'));
		}
	}

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
