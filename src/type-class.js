const { CONSTRUCTOR } = require('./private-constants.js');

const TypeClass = function (name, ...methods) {
  if (!(this instanceof TypeClass)) {
    return new TypeClass(name, ...methods);
  }

  this.name = name;

  if (Array.isArray(methods[0])) {
    this.methods = methods[0];
    this.staticMethods = methods[1] || [];
    this.superClasses = methods[2] || [];
  } else {
    this.methods = methods;
    this.staticMethods = [];
    this.superClasses = [];
  }
};

//- takes a value and checks if its type is an instance of the type class
//- this is necessary because some type class implementation (e.g. for
//- primitives) might overwrite this method, requiring a value to check
//- instead of a type representation.
//+ isInstance :: TypeClass ~> a -> Bool
TypeClass.prototype.isInstance = function (o) {
  const type = o[CONSTRUCTOR];
  if (!type) {
    return false;
  }

  const p = type.getPrototype();
  return this.methods.every(
    m => typeof p[m] === 'function'
  ) && this.staticMethods.every(
    m => typeof type[m] === 'function'
  ) && this.superClasses.every(
    s => s.isInstance(o)
  );
};

//- takes a type and returns what methods are missing to be an instance of this
//- type class
//+ assertTypeParameter :: TypeClass ~> TypeRep a -> [String]
TypeClass.prototype.missing = function (type) {
  const missing = [];

  // check the required instance methods
  const p = type.getPrototype();
  this.methods.forEach(m => {
    if (typeof p[m] !== 'function') {
      missing.push(`${this.name}: Missing method '${m}'`);
    }
  });

  // check the required static methods
  this.staticMethods.forEach(m => {
    if (typeof type[m] !== 'function') {
      missing.push(`${this.name}: Missing static method '${m}'`);
    }
  });

  return [].concat.apply(
    [],
    this.superClasses.map(s => s.missing(type))
  ).concat(missing);
}

//- takes a type parameter and checks if the contained type is an instance of
//- the type class (without having access to a value of the type).
//- Throws a TypeError otherwise
//+ assertTypeParameter :: TypeClass ~> TypeParameter a -> ()
TypeClass.prototype.assertTypeParameter = function (param) {
  if (!param.isSpecified()) {
    throw new TypeError(
      `Cannot check if unspecified type parameter '${param.name}'
       is an instance of '${this.name}'`
    );
  }

  const missing = this.missing(param.type).map(
    x => '\n         * ' + x
  ).join('');

  if (missing.length > 0) {
    throw new TypeError(
      `Type parameter '${param.name}' (containing the type '${param.type.toString()}') is required
       to be an instance of '${this.name}': ${missing}`
    );
  }

  this.superClasses.forEach(c => c.assertTypeParameter(param));
};

//- converts the type class to a human readable form
//+ toString :: TypeClass ~> String
TypeClass.prototype.toString = function () {
  return this.name;
};

module.exports = TypeClass;
