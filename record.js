const moment = require('moment-timezone');
const helpers = require('./helpers');
const { 
	defaultFields, authorPattern, 
	outOfRange, n 
} = helpers; 

/**
* Record class describes a Whatsapp record
*/
class Record {
	/**
	* Constructor for Record instances
	* @param record {String} - The string to parse
	* @param pattern {RegExp} - regular expression to match against 
	*/
	constructor(record, pattern) {	
		this.date = null;
		this.author = '';
		this.content = '';
		const matches = record.match(pattern);
		this.parse(...matches);
	}

	/**
	* Return record in csv format
	* @param outputs {Array} - Array of functions. each function is a filed
	* @return data {Array} - String Array of 
	*/
	toCSV(outputs) {
		return outputs.map(output => output(this));
	}

	/**
	* Parse record as string to Record object.
	*/
	parse(match, datestring, content) {
		this.date = datestring;
		var authorMatch = content.match(authorPattern);
		if (authorMatch) {
			this.author = authorMatch[1];
			content = content.substring(this.author.length+2);
		}
		this.content = content;
	}
	
	formatDate(inputFormat, outputFormat) {
		this.date = moment(this.date, inputFormat).format(outputFormat)
		return this;
	}
	
	time(format) {
		return moment(this.date, format);
	}
}

Record.defaultFields = defaultFields;

module.exports = Record;
