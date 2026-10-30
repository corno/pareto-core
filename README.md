this is one of the packages of the [Exupery language](https://github.com/corno/exupery-documentation)

this package is solely meant to be used by exupery-core-* packages.
It contains common types and functions that can be used by those packages

### Sequential list resolution

Both `pareto-core/transformer` and `pareto-core/refiner` expose
`from.list(input).resolve((item, preceding) => result)` (also through `convert`).
The callback runs once per input item, in order. `preceding` is an
`Optional_Value<Result>`: unset for the first item, and set to the immediately
preceding resolved result for subsequent items, including null or optional-valued
results. The returned `List<Result>` retains every result in input order; it is
not a reduction. Empty input returns an empty list without invoking the callback.
Each call has independent state, leaves the input unchanged, and propagates
callback errors without processing later items.

To select only the final result, use the transformer's
`from.list(resolved).on_has_last_item(last => last, () => startingValue)`.
For directly building a nested value from a starting value, a reduction is a
more direct fit because intermediate results are not needed.

Validate after compiling the library:

```sh
tsc -p typescript/lib
node --test typescript/test/list-resolve.test.mjs
tsc -p typescript/test/type-tests
```

### Refiners with lookups

`pareto-core/refiner` exports
`Refiner_With_Lookups_And_Parameter<Result, Error, Input, Lookups, Parameter>`.
Its argument order is `context, abort, lookups, parameters`. Lookup groups can
contain `lookup.Acyclic<T>`, `lookup.Cyclic<T>`, and `lookup.Stack<T>`.
Use `null` for an empty lookup or parameter group. Optional value parameters
can use `Optional_Value<T>` from `pareto-core/schema`; optional lookup entries
can use `null | lookup.Acyclic<T>` (or the corresponding cyclic/stack type).
Lookup groups are not restricted to schema values because lookups contain
functions.

This signature is separate from the existing two- and three-argument refiners;
their calling conventions are unchanged.

Type-check the signature tests after compiling the library:

```sh
tsc -p typescript/test/type-tests
```

### Text and number serialization

`from.text(value).serialize(serializer)` and
`from.number(value).serialize(serializer)` call a supplied transformer once with
the original value and return its string result. They do not choose a formatting
policy, round numbers, or catch serializer errors. Negative zero, NaN, and infinities
reach the number serializer unchanged. The `convert` alias exposes the same API.

`from.text(value).escape(mappings, abort)` accepts a Pareto List of
`{ character: number, emit: string }` mappings. Characters are UTF-16 code units
(integers from 0 through 65535), matching the existing text/list helpers. Unlisted
units are preserved; an empty replacement removes a unit; replacement strings can
contain Unicode and are not escaped again. Invalid codes call
`abort.invalid_character(code)` and duplicates call `abort.duplicate_character(code)`.
Both callbacks must abort (return `never`). The entire table is checked even when
the input text is empty.

Compile the library and run the serialization tests:

```sh
tsc -p typescript/lib
node --test typescript/test/serialization.test.mjs
```