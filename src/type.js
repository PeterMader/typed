const { TYPE, CONSTRUCTOR } = require('./private-constants.js');

const createType = (name, construct) => {
  function Type (...args) {
    if (this instanceof Type) {
      throw new TypeError(`Can't instanciate the type constructor '${name}'`);
    }
    return construct(...args);
  }
  Object.defineProperty(Type, 'name', {
    value: name
  });
  Type.toString = () => name;
  Type.is = o => typeOf(o).equals(Type);
  Type.prototype[CONSTRUCTOR] = Type;
  Type.getPrototype = () => Type.prototype;
  return Type;
};

//+ typeOf :: a -> TypeRep a
const typeOf = x => x[CONSTRUCTOR];

const type = module.exports = {
  createType,
  typeOf
};
