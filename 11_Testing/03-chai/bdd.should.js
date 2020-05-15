const should = require('chai').should();

const user = {
  name: 'Maxim',
  age: 25,
  lang: ['Js', 'C++', 'Rust', 'Python'],
};

user.should.have.property('name', 'Maxim');

user.should.have.property('lang').with.lengthOf(4);
