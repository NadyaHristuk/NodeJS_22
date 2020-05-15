const assert = require('assert');

let a = 2;
let b = '2';
let obj1 = {
	a: 1
};
let obj2 = {
	a: 1
};

assert.equal(a, b, 'Ошибка: а не равно b');
// assert.strictEqual(a, b, 'Ошибка strict: а не равно b');
// assert.notStrictEqual(a, b, 'Error a === b')
assert.deepEqual(obj1, obj2, 'Error obj !=');

assert(a === b, 'Ошибка: а не равно b ===');
assert.ok(a === b);
