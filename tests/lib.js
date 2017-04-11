const should = require('should');
const lib = require('../src/lib.js');

describe('lib', function() {
    it('parseURI', function() {
        let testData = [
            {
                input: 'http://www.example.com/image.jpg?resize=100X200',
                output: {
                    uri: 'http://www.example.com/image.jpg',
                    resize: {
                        width: 100,
                        height: 200
                    }
                }
            },
            {
                input: 'http://www.example.com/image.jpg',
                output: {
                    uri: 'http://www.example.com/image.jpg',
                }
            },
            {
                input: 'http://www.example.com/image.jpg?resize=100',
                output: null
            },
            {
                input: 'http://www.example.com/image.jpg?resize=X300',
                output: null
            },
            {
                input: 'http://www.example.com/image.jpg?resize=100X200O',
                output: null
            }
        ];

        testData.map((data) => {
            if (data.output) {
                lib.parseURI(data.input).should.be.eql(data.output);
            } else {
                (function(){ lib.parseURI(data.input); }).should.throw();
            }
        });
    });
});
