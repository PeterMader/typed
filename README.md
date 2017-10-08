# typed

Adds a functional type system to JavaScript.

```JavaScript
const t = require('typed');

const Maybe = t.data('Maybe', ['a'], {
  Nothing: {},
  Just: { value: 'a' }
});

const { Nothing, Just } = Maybe;

Maybe.of = v => Just({ value: v });

//- Functor implementation
//+ map :: Maybe a ~> (a -> b) -> Maybe b
Maybe.prototype.map = function (f) {
  return this.cata({
    Nothing,
    Just: ({ value }) => Maybe.of(f(value))
  });
};

// ...

const List = t.data('List', ['a'], {
  Nil: {},
  Cons: { head: 'a', tail: () => List('a') }
});

const { Nil, Cons } = List;

List.of = v => Cons({ head: v, tail: Nil() });

List.from = xs => xs.reduceRight((tail, head) => Cons({ head, tail }), Nil());

//- Functor implementation
//+ map :: List a ~> (a -> b) -> List b
List.prototype.map = function (f) {
  return this.cata({
    Nil,
    Cons: ({ head, tail }) => Cons({ head: f(head), tail: tail.map(f) })
  });
};
```
