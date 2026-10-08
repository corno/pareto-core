this is one of the packages of the [Exupery language](https://github.com/corno/exupery-documentation)

this package is solely meant to be used by exupery-core-* packages.
It contains common types and functions that can be used by those packages

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