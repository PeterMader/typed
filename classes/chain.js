const TypeClass = require('../src/type-class.js');
const Apply = require('./apply.js');

const Chain = TypeClass(
  'Chain',    // name
  ['chain'],  // instance methods
  [],         // static methods
  [Apply]     // super type classes
);

module.exports = Chain;
