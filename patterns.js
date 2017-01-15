const authorPattern = /^([^:]+):/;
const Patterns = [
	{
		regexp: /^(\d\d\/\d\d\/\d\d, \d\d:\d\d) - ([\s\S]+)/,
		format: 'DD/MM/YY HH:mm'
	},{
		regexp: /^(\d\d\/\d\d\/\d\d\d\d, \d\d?:\d\d? [ap]\.m\.?) - ([\s\S]+)/i,
		format: 'DD/MM/YYYY HH:mm A'
	},{
		regexp: /^(\d\d-\d\d-\d\d \d\d:\d\d:\d\d): ([\s\S]+)/,
		format: 'DD/MM/YY HH:mm:ss'
	}
];

module.exports = function match(text) {
	for (let i = 0; i < Patterns.length; i++) {
		if (Patterns[i].regexp.test(text) {
			return Patterns[i];
		}
	}
	return null;
}
module.exports.authorPattern = authorPattern;
