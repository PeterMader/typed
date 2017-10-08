const { data } = require('../index.js');

//+ data Maybe a = Mothing | Just a
const Maybe = data('Maybe', ['a'], {
  Nothing: {},
  Just: { value: 'a' }
});

const { Nothing, Just } = Maybe;

module.exports = Maybe;

//- implementation for Setoid
//+ equals :: Setoid a => Maybe a ~> Maybe a -> Bool
Maybe.prototype.equals = function (a) {
  return this.cata({
    Nothing: () => Nothing.is(a),
    Just: ({ value }) => !Nothing.is(a) && a.value.equals(value)
  });
};

//- implementation for Functor
//+ map :: Maybe a ~> (a -> b) -> Maybe b
Maybe.prototype.map = function (f) {
  return this.cata({
    Nothing,
    Just: ({ value }) => Just({ value: f(value) })
  });
};

//- implementation for Apply
//+ ap :: Maybe a ~> Maybe (a -> b) -> Maybe b
Maybe.prototype.ap = function (m) {
  if (Nothing.is(m)) {
    return Nothing();
  }

  return this.cata({
    Nothing,
    Just: ({ value }) => m.map(f => f(value))
  });
};

//- implementation for Applicative
//+ of :: TypeRep Maybe ~> a -> Maybe a
Maybe.of = value => Just({ value });

//- implementation for Chain
//+ join :: Maybe (Maybe a) ~> Maybe a
Maybe.prototype.join = function () {
  return this.cata({
    Nothing,
    Just: ({ value }) => value
  });
};

//+ chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
Maybe.prototype.chain = function (f) {
  return this.map(f).join();
};
