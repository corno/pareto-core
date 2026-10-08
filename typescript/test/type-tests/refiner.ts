import type * as p_ from '../../lib/dist/refiner.js'
import type * as p_di from '../../lib/dist/schema.js'

type Entry = { readonly name: string }
type Error = { readonly message: string }
type Lookups = {
    readonly acyclic: p_.lookup.Acyclic<Entry>
    readonly cyclic: p_.lookup.Cyclic<Entry>
    readonly stack: p_.lookup.Stack<Entry>
    readonly optional: null | p_.lookup.Acyclic<Entry>
}
type Parameters = { readonly entry: p_di.Optional_Value<Entry> }

declare const resolve: p_.Refiner_With_Lookups_And_Parameter<Entry, Error, string, Lookups, Parameters>
declare const lookups: Lookups
declare const parameters: Parameters
declare const abort: (error: Error) => never

const result: Entry = resolve('input', abort, lookups, parameters)
// @ts-expect-error Lookup and parameter groups are distinct arguments.
resolve('input', abort, parameters, lookups)
// @ts-expect-error Both group slots must be supplied.
resolve('input', abort, lookups)
// @ts-expect-error A cyclic lookup cannot replace an acyclic lookup.
resolve('input', abort, { ...lookups, acyclic: lookups.cyclic }, parameters)

const empty: p_.Refiner_With_Lookups_And_Parameter<string, null, string, null, null> =
    (context, _abort, _lookups, _parameters) => context
empty('input', (_error) => { throw new Error('unexpected error') }, null, null)
// @ts-expect-error Empty groups use null, not symbol.
empty('input', (_error) => { throw new Error('unexpected error') }, Symbol(), null)
void result
