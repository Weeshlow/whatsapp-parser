const moment = require('moment-timezone');
const defaultFields = require('./default-fields');
const linePattern = /^(\d\d\/\d\d\/\d\d, \d\d:\d\d - .+)/;
const authorPattern = /^([^:]+):/;
const recordPattern = /^(\d\d)\/(\d\d)\/(\d\d), (\d\d):(\d\d) - ([\s\S]*)/;
const DATE_FORMAT = {
	input: 'DD/MM/YY HH:mm',
	output: 'MM-DD-YYYY HH:mm:ss'
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
function getDate(day, month, year, hour, minutes) {
	var datestring = `${day}/${month}/${year} ${hour}:${minutes}`;
	var { input, output } = DATE_FORMAT;
	// moment.tz(momentObject, zone).format();  // convert to time with zone offset
	// var date;
	// if (zone) {
		// date = moment.tz(datestring, format, zone).utc();
	// } else {
		// date = moment(datestring, format);
	// }
	return moment(datestring, input).format(output);
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
	outOfRange,
	getDate,
	addRecord,
	n
};
