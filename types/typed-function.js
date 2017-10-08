const createParametrizedType = require('../src/parametrized-type.js');
const { TYPE } = require('../src/private-constants.js');
const { typeOf } = require('../src/type.js');

const TypedFunction = createParametrizedType('TypedFunction', ['a', 'b'], (type, f) => {
  const [ { type: a }, { type: b } ] = type.types;
  const r = x => {
    if (!a.is(x)) {
      const name = f.name || '(anonymous function)';
      throw new TypeError(
        `Typed function '${name}' expects its argument
         to be of type '${a.toString()}', '${typeOf(x).toString()}' given.`
      );
    }
    const result = f(x);
    if (!b.is(result)) {
      const name = f.name || '(anonymous function)';
      throw new TypeError(
        `Typed function '${name}' should return a value of type
         '${b.toString()}', but its return value is of type '${typeOf(result).toString()}'.`
      );
    }
    return result;
  };
  r[TYPE] = type;
  return r;
});

module.exports = TypedFunction;
