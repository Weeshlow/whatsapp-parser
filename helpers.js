const fs = require('fs');
const Readable = require('stream').Readable;
const moment = require('moment-timezone');
const defaultFields = require('./default-fields');
const matchPattern = require('./patterns');
const authorPattern = /^([^:]+):/;

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
	authorPattern,
	outOfRange,
	streamify,
	getReadable,
	matchPattern,
	n
};
