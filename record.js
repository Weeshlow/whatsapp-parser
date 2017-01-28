const moment = require('moment-timezone');
const helpers = require('./helpers');
const { 
	defaultFields, authorPattern, 
	outOfRange, toInteger 
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
	
	/**
	* Format date string.
	* @param inputFormat {String} input format
	* @param outputFormat {String} output format
	* @return formatted date string
	*/	
	formatDate(inputFormat, outputFormat) {
		this.date = moment(this.date, inputFormat).format(outputFormat)
		return this;
	}
	
	/**
	* Convert datestring to date object.
	* Accepts an optional timezone argument
	* @param format {String} time format of datestring
	* @param timezone {String} time zone
	* @return date {Object}
	*/
	time(format, timezone='') {
		var timestamp;
		if (timezone) {
			timestamp = moment.tz(this.date, format, timezone).utc().valueOf();
		}
		else {
			timestamp = moment(this.date, format).utc().valueOf();
		}
		return timestamp;
	}
}

Record.defaultFields = defaultFields;

module.exports = Record;
