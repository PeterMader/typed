const TypeClass = require('../src/type-class.js');
const Apply = require('./apply.js');

const Applicative = TypeClass(
  'Applicative',  // name
  [],             // instance methods
  ['of'],         // static methods
  [Apply]         // super type classes
);

module.exports = Applicative;
