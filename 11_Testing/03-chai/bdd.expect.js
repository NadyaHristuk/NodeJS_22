const { expect } = require('chai');

const user = {
	name: 'Maxim',
	age: 25,
	lang: [ 'Js', 'C++', 'Rust', 'Python' ]
};

expect(user.name).to.be.a('string');

expect(user.age).to.be.equal(25);

expect(user.lang).to.have.length(4);

expect(user).to.have.property('lang').with.length(4);

expect(user.age, 'Maxim is 25 age').to.equal(25);
