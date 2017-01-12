const defaultFields = [
	{
		name: 'date',
		output: (rec) =>  rec.datepart
	},
	{
		name: 'hour',
		output: (rec) => rec.hourpart
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
