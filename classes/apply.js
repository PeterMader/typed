const TypeClass = require('../src/type-class.js');
const Functor = require('./functor.js');

const Apply = TypeClass(
  'Apply',   // name
  ['ap'],    // instance methods
  [],        // static methods
  [Functor]  // super type classes
);

module.exports = Apply;
