const moment = require('moment-timezone');
const helpers = require('./helpers');
const { authorPattern } = helpers; 

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
		this.parse(...record.match(pattern));
	}

	/**
	* Return record in csv format
	* @param outputs {Array} - Array of functions (each function is a field).
	* @return data {Array} - Array of fields
	*/
	toCSV(outputs) {
		return outputs.map(output => output(this));
	}

	/**
	* Parse record as string to Record object. 
	* This method will try to extract author from content.
	* @param match {String} full match of the string and pattern provided in the constructor function
	* @param datestring {String} Record date
	* @param content {String} Record content
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
	* @return this {Record}
	*/	
	formatDate(inputFormat, outputFormat) {
		this.date = moment(this.date, inputFormat).format(outputFormat);
		return this;
	}
	
	/**
	* Convert datestring to timestamp.
	* Accepts an optional timezone argument
	* @param format {String} time format of datestring
	* @param timezone {String} time zone
	* @return timestamp {Number}
	*/
	time(format, timezone='') {
		var date;
		if (timezone) {
			date = moment.tz(this.date, format, timezone);
		}
		else {
			date = moment(this.date, format);
		}
		return date.valueOf();
	}
}

module.exports = Record;
