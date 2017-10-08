const Maybe = data('Maybe', 1, a => ({
  Nothing: {},
  Just: { value: a }
})).create();

const List = data('List', 1, a => ({
  Nil: {},
  Cons: { head: a, tail: List(a) }
}));

List.create();

const Either = data(Either, 2, (a, b) => ({
  Left: { value: a },
  Right: { value: b }
}));
