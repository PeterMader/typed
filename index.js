const data = require('./src/data.js');
const TypeClass = require('./src/type-class.js');
const TypeParameter = require('./src/type-parameter.js');
const { typeOf } = require('./src/type.js');

const { Int, Float } = require('./types/numbers.js');
const types = {
  TypedFunction: require('./types/typed-function.js'),
  Int,
  Float
};

const Num = require('./classes/num.js');
const Semigroup = require('./classes/semigroup.js');
const Monoid = require('./classes/monoid.js');
const Functor = require('./classes/functor.js');
const Apply = require('./classes/apply.js');
const Applicative = require('./classes/applicative.js');
const Chain = require('./classes/chain.js');
const Monad = require('./classes/monad.js');
const classes = {
  Num,
  Semigroup,
  Monoid,
  Functor,
  Apply,
  Applicative,
  Chain,
  Monad
};

module.exports = {
  data,
  typeOf,
  types,
  classes,
  TypeClass,
  TypeParameter
};
