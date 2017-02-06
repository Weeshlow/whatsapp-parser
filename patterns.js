const authorPattern = /^([^:]+):/;

const Patterns = [
  /^(\d\d\/\d\d\/\d\d, \d\d:\d\d) - ([\s\S]+)/,
  /^(\d\d\/\d\d\/\d\d\d\d, \d\d?:\d\d? [ap]\.m\.?) - ([\s\S]+)/i,
  /^(\d\d-\d\d-\d\d \d\d:\d\d:\d\d): ([\s\S]+)/
];

/**
* Match text to pattern
* 
* @param text {String} - text to match with pattern.
* @return pattern {RegExp|null}
*/
function match(text) {
  for (let pattern of Patterns) {
    if (pattern.test(text)) {
      return pattern;
    }
  }
  return null;
}
module.exports = match;
module.exports.authorPattern = authorPattern;
