const createPrimitiveType = require('../src/primitive-type.js');
const { CONSTRUCTOR, TYPE } = require('../src/private-constants.js');

const Int = createPrimitiveType('Int');
Int.is = Number.isInteger;
Int.getPrototype = () => Number.prototype;

const Float = createPrimitiveType('Float');
Float.is = d => typeof d === 'number';
Float.getPrototype = () => Number.prototype;

Object.defineProperty(Number.prototype, CONSTRUCTOR, {
  enumerable: false,
  get: function () {
    return Number.isInteger(this.valueOf()) ? Int : Float;
  },
  set: () => undefined
});

Object.defineProperty(Number.prototype, TYPE, {
  enumerable: false,
  get: function () {
    return Number.isInteger(this.valueOf()) ? Int : Float;
  },
  set: () => undefined
});

module.exports = { Int, Float };
