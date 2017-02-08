# Parser for whatsapp log files.

## Where To Use
Currently the module is useable only in NodeJS environment.

In the future it will be available for use in browser environment.

## How to Use
First require the module and create an instance.

```js
const Whatsapp = require('whatsapp-parser');
const whatsapp = new Whatsapp();
```
Then you can use the `whatsapp` instance to parse a File/String/Array.

### File
```js
whatsapp.parseFile('path/to/file.txt');
```

### String
```js
whatsapp.parse('27/02/14 05:16:12: Steve Rogers changed the subject to "The Avengers"\n27/02/14 05:16:18: Tony Stark was added');
```

### Array
```js
whatsapp.parse(['27/02/14 05:16:12: Steve Rogers changed the subject to "The Avengers"', '27/02/14 05:16:18: Tony Stark was added']);
```

Note: `whatsapp.parse` is used for parsing both strings and arrays.

## Convert text records to Javascript objects.

### Records
A record is a JS object created with the `Record()` constructor with the own properties of `date`, `author`, `content`
```js
{
	date: '14/11/16 12:12',
	content: 'Hi man',
	author: 'Ron'
}
```

Note: while records always have a `date` and `content` properties with a value, the `author` property is not guaranteed
to have a value.

This is due to 'System' messages without author.

The parsing returns a promise which is resolved with the parsed records:
```js
whatsapp
	.parseFile('path/to/file.txt')
	.then(records => console.log(records));
```

#### Record Pattern
A record is identified by using a regular expression pattern at the beginning of each line of input.

Log files have a unique pattern depending on the system locale settings.

##### Examples:
```
22/01/2016, 2:16 a.m. - Ricardo: hola, estás ahí?
22-01-16 14:15:49: U hebt de groepsafbeelding gewijzigd
22/01/16 14:22 - Ron: Hi whats up?
22/01/16, 14:07 - Ron: hello world
```

The module expects a RegExp pattern to use when matching lines of text.

A record is made up of at least 2 parts:

1. Date string
2. Content

The parser will try to extract an `author` from the `content` field, if possible. 
In that case the `content` will not show the author part of the string.

If a pattern is not provided to the parser it will try to **guess** it, based on the first line of text, using a list of known patterns.

It is advised to provide a pattern using the `pattern` method.

The pattern should include 2 capture groups, for `date` and `content`, correspondingly.

```js
whatsapp
	.pattern(/^(\d\d\/\d\d\/\d\d, \d\d:\d\d) - ([\s\S]+)/)
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

You can revert to single line mode using the `singleline` method.
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

// sample output: [{date: '01-29-2017 21:17:00', author: 'Ron', content: 'foo'}]
```

### Timestamp
To get a timestamp use the `timestamp` method.

The value is available on the record `timestamp` property.

You need to set date `format` when using this option:

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
	.parseFile('path/to/file.txt')
```

### Transforms
The module supports custom transformations for records.

A transform is a function which accepts a record instance and returns a record instance.
You can add transform functions using the `transform` method.

Transforms are applied to the record in the same order they were added.

```js
whatsapp
	.transform((rec) => {rec.t1 = 't1'; return rec;})
	.transform((rec) => {rec.t2 = 't2'; return rec;})
	.parseFile('path/to/file.txt');
	
// sample output: [{t1: 't1', t2: 't2', date: '29/01/17 21:17', author: 'Ron', content: 'foo'}]
```

# Todos
- [ ] Tests
- [ ] Browser compatiblity
- [ ] CLI interface
- [ ] Demo
