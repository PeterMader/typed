const t = require('../index.js');
const List = require('./list.js');
const Maybe = require('./maybe.js');

const safeDivision = a => b => b === 0
  ? Maybe.Nothing()
  : Maybe.of(a / b);

const half = a => a % 2 === 0 ? Maybe.of(a / 2) : Maybe.Nothing();

console.log(
  half(20)        // Just 10
    .chain(half)  // Just 5
    .chain(half)  // Nothing
    .toString()
);
