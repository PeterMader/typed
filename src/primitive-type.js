const { createType } = require('./type.js');

//+ createPrimitiveType :: String -> TypeRep a
const createPrimitiveType = name => {
  const Type = createType(name, () => {
    throw new TypeError(`Cannot parametrize the primitive type '${name}'.`);
  });
  Type.equals = o => o === Type;
  return Type;
};

module.exports = createPrimitiveType;
