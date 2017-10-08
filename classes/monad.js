const TypeClass = require('../src/type-class.js');
const Applicative = require('./applicative.js');
const Chain = require('./chain.js');

const Monad = TypeClass(
  'Monad',               // name
  [],                    // instance methods
  [],                    // static methods
  [Applicative, Chain]   // super type classes
);

module.exports = Monad;
