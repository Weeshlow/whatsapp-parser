var Record = require('../record');
var chai = require('chai');
var expect = chai.expect;

module.exports = function runTests() {
	describe('Record', function(){
		var string, pattern, record;
		
		beforeEach(function newRecord() {
			string = '27/02/14 06:29:21: Steve Rogers: We won.';
			pattern = /^(\d\d\/\d\d\/\d\d \d\d:\d\d:\d\d): ([\s\S]+)/;
			record = new Record(string, pattern);
		});
		
		describe('#constructor()', function() {
			
			it('should create new record', function() {
				expect(record).to.be.an.instanceof(Record);
			});
			
			it('should throw TypeError when not providing string or pattern', function() {
				var fn1 = function(){var r = new Record()};
				expect(fn1).to.throw(TypeError);
				
				var fn2 = function(){var r = new Record(string)};
				expect(fn2).to.throw(TypeError);
				
				var fn3 = function(){var r = new Record(undefined, pattern)};
				expect(fn3).to.throw(TypeError);
			});
			
		});
		
		describe('#parse()', function() {
			
			it('should have correct date', function() {
				expect(record.date).to.be.equal('27/02/14 06:29:21');
			});
			
			it('should have correct author', function() {
				expect(record.author).to.be.equal('Steve Rogers');
			});
			
			it('should not have author for system messages', function() {
				var rec = new Record('27/02/14 06:29:21: Tony Stark was added', pattern);
				expect(rec.author).to.be.equal('');
			});
			
			it('should have correct content', function() {
				expect(record.content).to.be.equal('We won.');
			});
			
		});
		
		describe('#formatDate()', function() {
			it('should format date', function() {
				record.formatDate('DD/MM/YY HH:mm:ss', 'DD-MM-YYYY HH:mm');
				expect(record.date).to.be.equal('27-02-2014 06:29');
			});
		});

		describe('#time()', function() {

			it('should return correct timestamp for UTC date string', function() {
				record.date = '02/27/2014 06:29:21Z';
				var d1 = record.time('MM/DD/YYYY HH:mm:ssZ');
				var date = new Date(record.date);
				var d2 = date.valueOf();
				expect(d1).to.be.equal(d2);
			});
			
			it('should return correct timestamp for timezone GMT+02:00', function() {
				record.date = '01/31/2017 20:51:00Z';
				var d1 = record.time('MM/DD/YYYY HH:mm:ssZ');
				record.date = '01/31/2017 20:51:00';
				var d2 = record.time('MM/DD/YYYY HH:mm:ss', 'Asia/Jerusalem');
				expect(d1).to.be.equal(d2+(1000*60*60*2));
			});
		});
	});
};
