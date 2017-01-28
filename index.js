const fs = require('fs');
const lineParser = require('./line-parser');
const Record = require('./record');
const helpers = require('./helpers');
const { getReadable, matchPattern, defaultFields } = helpers;

class Whatsapp {

	constructor() {
		this._pattern = null;
		this._format = {};
		this._multiline = false;
		this._transforms = [];
		this._timezone = '';
	}

	/**
	* Set regular expression pattern to match with records
	*
	* @param regexp {RegExp} - Regular expression.
	* @return this {Object}
	*/
	pattern(regexp=null) {
		if (regexp instanceof RegExp) {
			this._pattern = regexp;
		}
		return this;
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
	* Set timezone. This value is used when parsing record's datestring to date object
	* @param zone {String} 
	* @return this instance {Object}
	*/
	timezone(zone) {
		this._timezone = zone;
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
	* Set single line mode
	* Shortcut for using multiline(false)
	* @return this instance {Object}
	*/
	singleline() {
		this.multiline(false);
		return this;
	}
	
	/**
	* Add record transformation.
	* A transform is a function which accepts a record as a single argument and returns it.
	* @param fn the transformation to apply to the record
	* @return this instance {Object}
	*/	
	transform(fn) {
		this._transforms.push(fn);
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
	toCSV(records, filename, {encoding='utf8', fields=defaultFields} = {}) {
		var headers = [], outputs = [];
		for (let field of fields) {
			headers.push(field.name);
			outputs.push(field.output);
		}
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
		var pattern = this._pattern;
		var string = '';
		
		const multiLine = (isMatch, line) => {
			if (isMatch) {
				this._addRecord(string, records);
				string = line;
			}
			else {
				string += '\n' + line;
			}
		}
		const singleLine = (isMatch, line) => {
			if (isMatch) {
				this._addRecord(line, records);
			}
		}
		let parse = this._multiline ? multiLine : singleLine;

		return new Promise((resolve, reject) => {
			var onLine = (line) => {
				if (!pattern) {
					pattern = this._guessPattern(line);
					if (!pattern) {
						reject('Could not parse - record pattern not found');
						return rl.close();
					}
				}
				parse(pattern.test(line), line);
			}
			var onClose = () => {
				if (this._multiline) {
					this._addRecord(string, records);
				}
				resolve(records);
			}

			var rl = lineParser(inputStream, onLine, onClose);
		});
	}
	
	// create record and apply transformations before returning it.
	_transform(record) {
		var {input, output } = this._format;
		var dateFormat = output || input;
		if (input && output) {
			record = record.formatDate(input, output);
		}
		if (this._timestamp === true && dateFormat) {
			record.timestamp = record.time(dateFormat, this._timezone);
		}
		for (let transform of this._transforms) {
			record = transform(record);
		}
		return record;
	}
	
	// add record to list. return list
	_addRecord(str, records) {
		let record = null;
		if (str.length > 0) {
			record = new Record(str, this._pattern);
		}
		if (record !== null) {
			records.push(this._transform(record));
		}
		return records;
	}

	// guess the file record pattern using input line
	_guessPattern(line) {
		var pattern = matchPattern(line);
		if (pattern) {
			this.pattern(pattern);
		}
		return pattern;
	}
}

module.exports = Whatsapp;
