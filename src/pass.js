const createPrimitiveType = require('./primitive-type.js');

//+ pass :: (name, ...(a -> Bool)) -> TypeRep a
const pass = (name, ...conditions) => {
  const Type = createPrimitiveType(name, () => {});
  Type.is = o => condition.every(c => c(o));
  return Type;
};

module.exports = pass;
