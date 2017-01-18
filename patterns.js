const authorPattern = /^([^:]+):/;

const Patterns = [
	/^(\d\d\/\d\d\/\d\d, \d\d:\d\d) - ([\s\S]+)/,
	/^(\d\d\/\d\d\/\d\d\d\d, \d\d?:\d\d? [ap]\.m\.?) - ([\s\S]+)/i,
	/^(\d\d-\d\d-\d\d \d\d:\d\d:\d\d): ([\s\S]+)/
];

module.exports = function match(text) {
	for (let i = 0; i < Patterns.length; i++) {
		if (Patterns[i].test(text)) {
			return Patterns[i];
		}
	}
	return null;
}
module.exports.authorPattern = authorPattern;

// const Patterns = [
	// {
		// regexp: /^(\d\d\/\d\d\/\d\d, \d\d:\d\d) - ([\s\S]+)/,
		// format: 'DD/MM/YY HH:mm'
	// },{
		// regexp: /^(\d\d\/\d\d\/\d\d\d\d, \d\d?:\d\d? [ap]\.m\.?) - ([\s\S]+)/i,
		// format: 'DD/MM/YYYY HH:mm A'
	// },{
		// regexp: /^(\d\d-\d\d-\d\d \d\d:\d\d:\d\d): ([\s\S]+)/,
		// format: 'DD/MM/YY HH:mm:ss'
	// }
// ];