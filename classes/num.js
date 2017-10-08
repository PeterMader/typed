const TypeClass = require('../src/type-class.js');

const Num = TypeClass('Num');

//- checks if a value is a number
//+ isNumber :: a -> Bool
const isNumber = a => typeof a === 'number' || typeof a.valueOf() === 'number';

Num.isInstance = isNumber;

module.exports = Num;
