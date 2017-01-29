# Parser for whatsapp exported text files.

## Where To Use
Currently the module is useable only in nodejs environment.

## How to Use
First require the module and create an instance

```js
const Whatsapp = require('whatsapp-parser');
const whatsapp = new Whatsapp();
```
Then you can use the `whatsapp` instance to parse a file/string/string array

### Files
```js
whatsapp.parseFile('path/to/file.txt');
```

### Strings
```js
whatsapp.parse('whatsapp-log-text');
```

### Arrays
```js
whatsapp.parse(['message_1', 'message_2']);
```

Note `whatsapp.parse` is used for parsing both string and string array inputs.

## Convert each line of text to javascript objects.

### Records
A record is a JS object created with the `Record` with the own properties of `date`, `author`, `content`
```js
{
	date: '14/11/16 12:12',
	content: 'Hi man',
	author: 'Ron'
}
```

Note: while records always have a `date` and `content` properties with a value, the `author` property is not guaranteed
to have a value. This is due to 'System' messages without author.

The parsing returns a promise which is resolved with the parsed records:
```js
whatsapp
	.parseFile('path/to/file.txt')
	.then(records => console.log(records));
```

#### Record Pattern
A record is identified by using a regular expression pattern at the beginning of each line of input.
Whatsapp chat log files have a unique pattern depending on the system locale settings.

Examples:
```
22/01/2016, 2:16 a.m. - Ricardo: hola, estás ahí?
22-01-16 14:15:49: ‎U hebt de groepsafbeelding gewijzigd
22/01/16 14:22 - Ron: Hi whats up?
```

The module expects a RegExp pattern to use when matching lines of text.
If a pattern is not provided it will try to guess based on the first line of text from a list of available patterns.

It is advised to provide a pattern using the `pattern` method.

```js
whatsapp
	.pattern(/^(\d\d\/\d\d\/\d\d, \d\d:\d\d - .+)/)
	.parseFile('path/to/file.txt')
	.then(records => console.log(records));
```

### Parse Mode
The text is parsed in one of 2 modes: 
- Single line (default)
- Multi line

In single line mode only the first line of each message is read,
The rest is discarded.

To enable multi line mode use the `multiline` method:
```js
whatsapp
	.multiline()
	.parseFile('path/to/file.txt')
	.then(records => console.log(records));
```

You can revert to single line mode using the `singleline` method
```js
whatsapp
	.multiline()
	.parseFile('path/to/file.txt')
	.then(handlerFunction);
	
whatsapp
	.singleline()
	.parseFile('path/to/file.txt')
	.then(handlerFunction);
```

### Date Format
Records have a date format which is locale specific.
To change the record date string format use the `format` method:
```js
whatsapp.format('DD/MM/YY, HH:mm', 'MM-DD-YYYY HH:mm:ss');
```

### Timestamp
To get a utc timestamp use the `timestamp` method.
The value is available on the record `timestamp` property
You need to set `format` when using this option:

```js
whatsapp
	.format('DD/MM/YY, HH:mm', 'MM-DD-YYYY HH:mm:ss')
	.timestamp()
	.parseFile('path/to/file.txt')
	.then(records => console.log(records));

	// sample output: [{date: '01-29-2017 21:17:00', timestamp: 1485717420000, author: 'Ron', content: 'foo'}]
```

#### Timezone
The default timezone when parsing utc timestamps is the system default setting.
You can provide a specific timezone using the `timezone` method.

`whatsapp-parser` uses [moment-timezone](http://momentjs.com/timezone/) under the hood for timezone conversions.

```js
whatsapp
	.format('DD/MM/YY, HH:mm', 'MM-DD-YYYY HH:mm:ss')
	.timestamp()
	.timezone('Europe/London')
```

### Transforms
The module supports custom transformations for records.

A transform is a function which accepts a record and returns a record.
You can add transform functions using the `transform` method.

Transforms are applied to the record in the same order they were added.

```js
	whatsapp
		.transform((rec) => {rec.t1 = 't1'; return rec;})
		.transform((rec) => {rec.t2 = 't2'; return rec;});
```
