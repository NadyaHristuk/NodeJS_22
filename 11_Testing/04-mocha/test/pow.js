const { assert } = require('chai');
const pow = require('../app');

describe('POW testing', function() {
  it('2 в степени 3 должно равняться 8', function() {
    assert.equal(8, pow(2, 3));
  });
  it('2 в степени 3 должно равняться 6', function() {
    assert.equal(6, pow(2, 3));
  });
});
