const { assert } = require('chai');

const user = {
	name: 'Maxim',
	age: 25,
	lang: [ 'Js', 'C++', 'Rust', 'Python' ]
};

assert.typeOf(user.age, 'number', 'age is number');
assert.equal(user.age, 25, 'age equal 25');
assert.lengthOf(user.lang, 4, 'has length 3');
