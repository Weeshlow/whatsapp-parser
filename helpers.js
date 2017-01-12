const moment = require('moment-timezone');
const defaultFields = require('./default-fields');
const linePattern = /^(\d\d\/\d\d\/\d\d, \d\d:\d\d - .+)/;
const authorPattern = /^([^:]+):/;
const recordPattern = /^(\d\d)\/(\d\d)\/(\d\d), (\d\d):(\d\d) - ([\s\S]*)/;

/**
* Format a date string from by replacing day and month components
* 
* @param dateString {String} - The string to format
* @return formatted string {String}
*/
function format(dateString) {
	return dateString.replace(/(\d\d)\/(\d\d)\/\d\d/, '$2/$1/');
}

/**
* checks if a number is outside a range
* 
* @param param {Number} - The number to check
* @param min {Number} - The minimum range
* @param max {Number} - The maximum range
* @return true if out of range or false otherwise
*/
function outOfRange(param, min, max) {
	return param > max || param < min;
}

/**
* Get Date object from string paramters
* 
* @param day {String} - day
* @param month {String} - month
* @param year {String} - year
* @param hour {String} - hour
* @param minutes {String} - minutes
* @return date {Date}
*/
function getDate(day, month, year, hour, minutes, zone) {
	var datestring = `${month}/${day}/${year} ${hour}:${minutes}:00`;
	var format = 'MM/DD/YYYY HH:mm:ss'
	// moment.tz(momentObject, zone).format();  // convert to time with zone offset
	var date;
	if (zone) {
		date = moment.tz(datestring, format, zone).utc();
	} else {
		date = moment(datestring, format);
	}
	return date;
}

/**
* Add records to collection
*
*/
function addRecord(records, Record, str) {
	if (typeof str === 'string' && str.length > 0) {
		records.push(new Record(str));
	}
}

const n = (x) => parseInt(x);

module.exports = {
	defaultFields,
	linePattern,
	authorPattern,
	recordPattern,
	format,
	outOfRange,
	getDate,
	addRecord,
	n
};
