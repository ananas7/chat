const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const sumlib = require('../index.js');

describe('sumlib, find sum two numbers', function () {
    it('numbers 2 and 3', function () {
        assert.equal(5, sumlib(2, 3));
    });
    it('numbers 1000 and 1', function () {
        assert.equal(1001, sumlib(1000, 1));
    });
});