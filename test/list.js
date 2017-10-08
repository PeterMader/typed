const { data } = require('../index.js');

//+ data List a = Nil | Cons a (List a)
const List = data('List', ['a'], {
  Nil: {},
  Cons: { head: 'a', tail: () => List('a') }
});

const { Nil, Cons } = List;

//+ length :: List a ~> Int
List.prototype.length = function () {
  return this.cata({
    Nil: () => 0,
    Cons: function () { return this.tail.length() + 1; }
  });
};

//+ foldr :: List a ~> ((b, a) -> b, b) -> b
List.prototype.foldr = function (f, i) {
  return this.cata({
    Nil: () => i,
    Cons: function () {
      return f(this.tail.foldr(f, i), this.head);
    }
  });
};

//+ foldl :: List a ~> ((b, a) -> b, b) -> b
List.prototype.foldl = function (f, i) {
  return this.cata({
    Nil: () => i,
    Cons: function () {
      return this.tail.foldl(f, f(i, this.head));
    }
  });
};

//+ show :: List a ~> String
List.prototype.show = function () {
  return '[' + this.cata({
    Nil: () => '',
    Cons: ({ head, tail }) => head.toString() + (Nil.is(tail) ? '' : ', ' + tail.show().slice(1, -1))
  }) + ']';
};

//+ filter :: List a ~> (a -> Bool) -> List a
List.prototype.filter = function (p) {
  return this.cata({
    Nil,
    Cons: ({ head, tail }) => p(head) ? Cons({ head, tail: tail.filter(p) }) : tail.filter(p)
  });
};

//+ take :: List a ~> Int -> List a
List.prototype.take = function (n) {
  if (n === 0) {
    return Nil();
  }

  return this.cata({
    Nil,
    Cons: ({ head, tail }) => Cons({ head, tail: tail.take(n - 1) })
  });
};

//+ drop :: List a ~> Int -> List a
List.prototype.drop = function (n) {
  if (n === 0) {
    return this;
  }

  return this.cata({
    Nil,
    Cons: ({ tail }) => tail.drop(n - 1)
  });
};

//+ concat :: List a ~> List a -> List a
List.prototype.concat = function (a) {
  return this.cata({
    Nil: () => a,
    Cons: ({ head, tail }) => Cons({ head, tail: tail.concat(a) })
  });
};

//+ empty :: TypeRep List ~> () -> List a
List.empty = Nil;

//+ from :: TypeRep List ~> [a] -> List a
List.from = xs => xs.reduceRight((acc, x) => Cons({ head: x, tail: acc }), Nil());

//+ range :: TypeRep List ~> (Int, Int) -> List Int
List.range = (min, max) => {
  const next = (acc, n) => n < min
    ? acc
    : next(Cons({ head: n, tail: acc }), n - 1);

  return next(Nil(), max);
};

module.exports = List;

//- implementation for Setoid
//+ equals :: Setoid a => List a ~> List a -> Bool
List.prototype.equals = function (a) {
  return this.length() === a.length() && false;
  return fs.map(f => this.map(f));
};

//- implementation for Functor
//+ map :: List a ~> (a -> b) -> List b
List.prototype.map = function (f) {
  return this.cata({
    Nil,
    Cons: ({ head, tail }) => Cons({ head: f(head), tail: tail.map(f) })
  });
};

//- implementation for Apply
//+ ap :: List a ~> List (a -> b) -> List (List b)
List.prototype.ap = function (fs) {
  return fs.map(f => this.map(f));
};

//- implementation for Applicative
//+ of :: TypeRep List ~> a -> List a
List.of = head => Cons({ head, tail: Nil() });

//- implementation for Chain
//+ join :: List (List a) ~> List a
List.prototype.join = function () {
  return this.cata({
    Nil,
    Cons: ({ head, tail }) => head.concat(tail.join())
  });
};

//+ chain :: List a ~> (a -> List b) -> List b
List.prototype.chain = function (f) {
  return this.map(f).join();
};
