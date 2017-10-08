const TypeParameter = function (name, ...classes) {
  if (!(this instanceof TypeParameter)) {
    return new TypeParameter(name, ...classes);
  }

  this.name = name;
  this.classes = classes;
  this.specified = false;
  this.type = undefined;
};

TypeParameter.prototype.clone = function () {
  const c = new TypeParameter(this.name, ...this.classes);
  c.specified = this.specified;
  c.type = this.type;
  return c;
};

TypeParameter.prototype.specify = function (type) {
  if (this.specified && !this.type.equals(type)) {
    throw new TypeError(
      `Trying to set the type variable '${this.name}' to '${type.toString()}',
       but it has already been set to '${this.type.toString()}'`);
  }
  this.type = type;
  this.classes.forEach(c => c.assertTypeParameter(this));
  this.specified = true;
  return this;
};

TypeParameter.prototype.isSpecified = function () {
  return this.specified;
};

TypeParameter.prototype.equals = function (other) {
  if (this.specified) {
    if (other.specified) {
      return this.type.equals(other.type);
    }
    return false;
  }

  // this.specified === false
  return this.specified === other.specified;
};

TypeParameter.prototype.toString = function () {
  return this.specified ? this.type.toString() : this.name;
};

TypeParameter.from = o => o instanceof TypeParameter ? o : new TypeParameter(o);

module.exports = TypeParameter;
