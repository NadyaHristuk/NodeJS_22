const { assert } = require('chai');

const user = {
  name: 'Maxim',
  age: 25,
  lang: ['Js', 'C++', 'Rust', 'Python'],
};

describe('hooks', function() {
  before(function() {
    user.name = 'Maximka';
  });

  after(function() {
    user.name = 'Maxim';
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  it('Maximka', function() {
    assert.equal(user.name, 'Maximka', 'Maximka the Best!');
  });
});
