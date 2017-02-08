const Whatsapp = require('../index');
const Record = require('../record');
const chai = require('chai');
const expect = chai.expect;

module.exports = function runTests() {
	describe('Whatsapp', function() {
		var whatsapp;		
		var pattern = /^(\d\d\/\d\d\/\d\d \d\d:\d\d:\d\d): ([\s\S]+)/;
		
		beforeEach(function newWhatsapp() {
			whatsapp = new Whatsapp();
		});
		
		describe('#constructor()', function() {		
			
			it('should create new whatsapp parser instance', function() {
				expect(whatsapp).to.be.an.instanceof(Whatsapp);
			});
			
			it('should set whatsapp instance with correct own properties', function() {
				const keys = ['_pattern', '_format', '_multiline', '_transforms', '_timezone', '_timestamp'];
				expect(whatsapp).to.have.all.keys(...keys);
			});
			
			it('should set whatsapp._pattern as null', function() {
				expect(whatsapp._pattern).to.be.null;
			});	
			
			it('should set whatsapp._format as new JS object', function() {
				expect(whatsapp._format).to.deep.equal({});
			});
			
			it('should set whatsapp._multiline as false', function() {
				expect(whatsapp._multiline).to.equal(false);
			});
			
			it('should set whatsapp._transforms as empty array', function() {
				expect(whatsapp._transforms).to.be.empty;
			});
			
			it('should set whatsapp._timezone as empty string', function() {
				expect(whatsapp._timezone).to.be.empty;
			});					
		});
		
		describe('#pattern()', function() {
			
			it('should set pattern', function() {
				whatsapp.pattern(pattern);
				expect(whatsapp._pattern).to.equal(pattern);
			});
			
			it('should NOT set pattern', function() {
				whatsapp.pattern('/^(\d\d\/\d\d\/\d\d \d\d:\d\d:\d\d): ([\s\S]+)/');
				expect(whatsapp._pattern).to.be.null;
			});
			
			it('should return whatsapp parser instance', function() {
				var w1 = whatsapp.pattern('/^(\d\d\/\d\d\/\d\d \d\d:\d\d:\d\d): ([\s\S]+)/');
				expect(w1).to.equal(whatsapp);
				
				var w2 = whatsapp.pattern(pattern);
				expect(w2).to.equal(whatsapp);
			});
			
		});		
		
		describe('#format()', function() {
			
			it('should set format', function() {
				whatsapp.format('DD/MM/YY', 'DD/MM/YYYY HH:mm');
				expect(whatsapp._format.input).to.equal('DD/MM/YY');
				expect(whatsapp._format.output).to.equal('DD/MM/YYYY HH:mm');
			});
			
		});			
	});
};
