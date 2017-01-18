const fs = require('fs');
const Readable = require('stream').Readable;
const moment = require('moment-timezone');
const defaultFields = require('./default-fields');
const matchPattern = require('./patterns');

const linePattern = /^(\d\d\/\d\d\/\d\d, \d\d:\d\d - .+)/;
const authorPattern = /^([^:]+):/;
const recordPattern = /^(\d\d\/\d\d\/\d\d, \d\d:\d\d) - ([\s\S]+)/;

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
// function getDate(datestring) {
	// const DATE_FORMAT = {
		// input: 'DD/MM/YY HH:mm',
		// output: 'MM-DD-YYYY HH:mm:ss'
	// }

	// var { input, output } = DATE_FORMAT;
	// moment.tz(momentObject, zone).format();  // convert to time with zone offset
	// var date;
	// if (zone) {
		// date = moment.tz(datestring, format, zone).utc();
	// } else {
		// date = moment(datestring, format);
	// }
	// var input = 'DD/MM/YY, HH:mm';
	// var output = 'MM-DD-YYYY HH:mm:ss';
	// return formatDate(datestring, input, output);
// }

const n = (x) => parseInt(x);

/**
* Convert string to readable stream
* 
* @param string {String} - The String to convert
* @return readable stream
*/
function streamify(string) {
	var s = new Readable();
	s._read = () => {};
	s.push(string);
	s.push(null);
	return s;
}

/**
* Get Readable stream from input value
* The value can be a path to a file, string, array of strings.
*
* @param value {mixed} - value to create Readable stream from.
* @param isFile {Boolean} - true to indicate value is a path
* @return readable stream {Stream}
*/
function getReadable(value, isFile=false) {
	switch(true) {
		case (isFile): return fs.createReadStream(value, 'utf8');
		case (typeof value === 'string'): return streamify(value);
		case (Array.isArray(value)): return getReadable(value.join('\n'));
	}
}

module.exports = {
	defaultFields,
	linePattern,
	authorPattern,
	recordPattern,
	outOfRange,
	streamify,
	getReadable,
	matchPattern,
	n
};
