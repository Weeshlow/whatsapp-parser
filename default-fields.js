const defaultFields = [
	{
		name: 'date',
		output: (rec) => rec.date
	},
	{
		name: 'author',
		output: (rec) => "\"" + rec.author + "\"",
	},
	{
		name: 'content',
		output: (rec) => "\"" + rec.content + "\"",
	}
];

module.exports = defaultFields;
