const { CONSTRUCTOR } = require('./private-constants.js');
const TypeParameter = require('./type-parameter.js');
const { createType, typeOf } = require('./type.js');

const createParametrizedType = (name, _params, done) => {
  const params = _params.map(TypeParameter.from);

  const Type = createType(name, (..._types) => {

    const types = params.map((param, index) => {
      const type = _types[index];
      if (typeof type === 'function') {
        return param.clone().specify(type);
      }
      return TypeParameter.from(type || _params[index]);
    });

    const typeName = name + ' ' + params.map(
      (param, index) => types[index] ? types[index].toString() : param.toString()
    ).join(' ');

    if (_types.length > params.length) {
      return done(Type(...types.slice(0, params.length)), ..._types.slice(params.length));
    }

    const f = (...other) => Type(...types.concat(other));
    f.baseType = Type;
    f.types = types;

    f.equals = other => {
      return other.baseType === Type && params.every((param, index) => {
        if (!types[index].isSpecified()) {
          return true;
        }
        return types[index].equals(other.types[index]);
      });
    };

    //+ inferTypeParams :: TypeRep a ~> TypeRep a ~> Object (TypeParameter a)
    f.inferTypeParams = other => {
      return types.reduce((acc, name, index) => {
        const type = other.types[index].type;
        if (type) {
          acc[name] = type;
        }
        return acc;
      }, {});
    };

    //+ is :: TypeRep a ~> b -> Bool
    f.is = v => f.equals(typeOf(v));

    //+ toString :: TypeRep a ~> () -> String
    f.toString = () => typeName;

    //+ getPrototype :: TypeRep a ~> () -> Object b
    f.getPrototype = () => Type.prototype;

    return f;
  });

  Type.is = o => o[CONSTRUCTOR].equals(Type);

  Type.equals = other => other.baseType === Type && other.params.every(p => !p || !p.isSpecified());

  Type.types = params;

  Type.baseType = Type;

  Type.parametrize = types => Type(
    ...params.map(param => types.hasOwnProperty(param) ? types[param] : undefined)
  );

  return Type;
};

module.exports = createParametrizedType;
