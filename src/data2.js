const TypeClass = require('./type-class.js');
const createParametrizedType = require('./parametrized-type.js');
const { CONSTRUCTOR, TYPE, PROPS, VALUE_CONSTRUCTOR } = require('./private-constants.js');
const { typeOf } = require('./type.js');

const recordsToString = values => {
  const keys = Object.keys(values);
  if (keys.length === 0) {
    return '';
  }
  const result = keys.map(
    prop => `${prop} = ${values[prop]} :: ${typeOf(values[prop]).toString()}`
  ).join(', ');
  return result ? ' { ' + result + ' }' : '';
};

const evalType = t => typeof t === 'function' && typeof t.is !== 'function' ? t() : t;

const data = (name, _params, specFunction) => {
  const Type = createParametrizedType(name, _params, t => {
    throw new TypeError(
      `Type '${name}' is already fully parametrized as '${t.toString()}'
       (Expected kind '* -> *', got kind '*').`
    );
  });
  const params = Type.types;

  let spec;

  Object.entries(spec).forEach(([k, props]) => {

    function Value (values = {}) {
      if (!(this instanceof Value)) {
        return new Value(values);
      }
      const usedTypeParams = params.reduce((acc, p) => {
        acc[p.name] = p.clone();
        return acc;
      }, {});
      const usedProperties = {};

      Object.keys(props).forEach(prop => {
        if (!values.hasOwnProperty(prop)) {
          throw new TypeError(`Missing definition of property '${prop}'`);
        }

        const type = evalType(props[prop]);
        const value = values[prop];

        if (typeof type === 'string') {
          // type must be a type variable
          if (!usedTypeParams.hasOwnProperty(type)) {
            throw new TypeError(
              `Unknown type variable '${type}'`
            );
          }

          usedTypeParams[type].specify(typeOf(value));
          usedProperties[prop] = value;
          return;
        } else if (type.is(value)) {
          const used = type.inferTypeParams(typeOf(value));
          Object.entries(used).forEach(([name, usedType]) => {
            // usedType is the type variable inferred from the value
            // Example: List('k').inferTypeParams(List(Bool)) === { k: (TypeVariable { name: 'k', type: Bool }) }

            // type variable already defined
            const setType = usedTypeParams[name];

            if (setType.isSpecified()) {
              if (!setType.type.equals(usedType)) {
                // will throw the error
                setType.specify(usedType);
              }
              return;
            }
            if (usedType.isSpecified()) {
              setType.specify(usedType.type);
            }
          });
          usedProperties[prop] = value;
          return;
        }

        throw new TypeError(`Property '${prop}' does not conform to type '${type.toString()}'`);
      });

      this[TYPE] = Type.parametrize(usedTypeParams);
      this[PROPS] = usedProperties;

      Object.assign(this, usedProperties);
    }

    Object.defineProperty(Value, 'name', {
      value: name + '.' + k
    });

    Value.constructorName = k;

    Value.is = o => o[VALUE_CONSTRUCTOR] === Value;
    Value.prototype = Object.create(Type.prototype);
    Value.prototype.constructor = Value;
    Value.prototype[VALUE_CONSTRUCTOR] = Value;
    Value.prototype.toString = function () {
      return `${name}.${k}${recordsToString(this[PROPS])}`;
    };
    Type[k] = Value;
  });

  Type.prototype.cata = function (fns) {
    const ctor = this[VALUE_CONSTRUCTOR].constructorName;
    if (fns.hasOwnProperty(ctor) && typeof fns[ctor] === 'function') {
      return fns[ctor](this[PROPS]);
    }
    throw new TypeError(`Missing function for value constructor '${ctor}'`);
  };

  return Type;
};

data.__ = undefined;

module.exports = data;
