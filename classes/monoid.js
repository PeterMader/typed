const TypeClass = require('../src/type-class.js');
const Semigroup = require('./semigroup.js');

const Monoid = TypeClass(
  'Monoid',   // name
  [],         // instance methods
  ['empty'],  // static methods
  [Semigroup] // super type classes
);

module.exports = Monoid;
