const helpers = require('./helpers');
const { 
	defaultFields, authorPattern, recordPattern, 
	format, outOfRange, getDate, n 
} = helpers; 

/**
* Record class describes a Whatsapp record
*/
class Record {
	/**
	* Constructor for Record instances
	* @param record {String} - The whatsapp record to parse
	*/
	constructor(record) {	
		this.date = null;
		this.author = '';
		this.content = '';
		const matches = record.match(recordPattern);
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
	parse(match, day, month, year, hour, minutes, content) {	
		this.date = getDate(day, month, year, hour, minutes, this.zone);
		this.datepart = [day, month, `20${year}`].join('/');
		this.hourpart = [hour,minutes].join(':');
		
		this.content = content;
		var authorMatch = this.content.match(authorPattern);
		if (authorMatch) {
			this.author = authorMatch[1];
			this.content = this.content.substring(this.author.length+1);
		}
	}
	
	/**
	* Get record different date parts as integers
	* @return date parts {Object}
	*/
	getDateParts() {
		var [day, month, year] = this.datepart.split('/').map(n);
		var [hour, minutes] = this.hourpart.split(':').map(n);
		return {day, month, year, hour, minutes};
	}
	
	/**
	* Set timezone
	* @param zone - Time zone 
	*/
	setZone(zone) {
		this.zone = zone;
	}
	/**
	* Set timezone for all instances (on the prototype)
	* @param zone - Time zone 
	*/
	static setZone(zone) {
		this.prototype.zone = zone;
	}
}

Record.defaultFields = defaultFields;

module.exports = Record;
