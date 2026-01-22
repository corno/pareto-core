import * as _pi from "../interface"

import { panic } from "../__internals/sync/expression/special"

import { $$ as sg } from "../__internals/sync/expression/decide/state_group/select"
import { $$ as ss } from "../__internals/sync/expression/decide/state_group/switch_state"
import { $$ as au } from "../__internals/sync/expression/decide/state_group/assert_unreachable"


import { $$ as list_literal } from "../__internals/sync/expression/literals/list"
import { $$ as dictionary_literal } from "../__internals/sync/expression/literals/dictionary"

import * as initialize from "../__internals/sync/expression/initialize"



//these types are used in generated resolve signatures
type Location_to_String<Source> = ($: Source) => string
export type _T_Location_2_String<Source> = Location_to_String<Source>

type Non_Circular_Result<T> =
    | ['error', ['circular', _pi.List<string>]]
    | ['resolved', T]

type Lookup<T> = { __get_possible_entry: (key: string) => _pi.Optional_Value<T> }
type Acyclic_Lookup<T> = _pi.Optional_Value<Lookup<Non_Circular_Result<T>>> //FIXME should this not be optional?
export type _T_Acyclic_Lookup<T> = Acyclic_Lookup<T>





type Possibly_Circular_Result<T> = _pi.Circular_Dependency<T>

type Cyclic_Lookup<T> = _pi.Optional_Value<Lookup<Possibly_Circular_Result<T>>> //FIXME should this not be optional?
export type _T_Cyclic_Lookup<T> = Cyclic_Lookup<T>

type Lookup_Stack<T> = _pi.List<Acyclic_Lookup<T>>
export type _T_Lookup_Stack<T> = Lookup_Stack<T>

namespace unresolved$ {

    export type Derived_Reference<M_Source, T_Type> = null

    export type Dictionary<M_Source, T_D> = {
        readonly 'dictionary': _pi.Dictionary<{
            readonly 'entry': T_D
            readonly 'location': M_Source
        }>
        readonly 'location': M_Source
    }

    export type List<M_Source, T_L> = {
        readonly 'list': _pi.List<{
            readonly 'element': T_L
            readonly 'location': M_Source
        }>
        readonly 'location': M_Source
    }

    export type Ordered_Dictionary<M_Source, T_D> = {
        readonly 'dictionary': _pi.Dictionary<{
            readonly 'entry': T_D
            readonly 'location': M_Source
        }>
        readonly 'location': M_Source
    }

    export type Reference_To_Circular_Dependent_Sibling<M_Source, T_Dictionary_Entry> = {
        readonly 'key': string
        readonly 'location': M_Source
    }

    export type Reference_To_Normal_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
        readonly 'key': string
        readonly 'location': M_Source
    }

    export type Reference_To_Stacked_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
        readonly 'key': string
        readonly 'location': M_Source
    }

    export type State_Group<M_Source, T_SG> = {
        readonly 'location': M_Source
        readonly 'state group': T_SG
    }
}

namespace resolved$ {

    export type Derived_Reference<M_Source, T_Type> = T_Type

    export type Dictionary<M_Source, T_D> = _pi.Dictionary<T_D>

    export type List<M_Source, T_L> = _pi.List<T_L>

    export type Ordered_Dictionary<M_Source, T_D> = {
        readonly 'dictionary': _pi.Dictionary<T_D>
        readonly 'ordered list': _pi.List<{
            readonly 'key': string
            readonly 'value': T_D
        }>
    }

    export type Reference_To_Circular_Dependent_Sibling<M_Source, T_Dictionary_Entry> = {
        readonly 'entry': _pi.Circular_Dependency<T_Dictionary_Entry>
        readonly 'key': string
    }

    export type Reference_To_Normal_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
        readonly 'entry': T_Dictionary_Entry
        readonly 'key': string
    }

    export type Reference_To_Stacked_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
        readonly 'entry': T_Dictionary_Entry
        readonly 'key': string
        readonly 'up steps': number
    }

    export type State_Group<M_Source, T_SG> = T_SG

}

export type Acyclic_Entry_Reference<T_Dictionary_Entry> = {
    readonly 'entry': T_Dictionary_Entry
    readonly 'key': string
}

type Key_Value_Location_Triplet<Source, T> = {
    'key': string,
    'value': T,
    'location': Source
}
export type Path<Source, Resolved_Element, Seed> = {
    'list': _pi.List<Resolved_Element>
    'result': {
        'data': Seed
    }
}
export type Resolved_Step<Resolved_Element, Seed> = {
    'element': Resolved_Element,
    'result': Seed
}


type Resolve_Error_Type =
    | ['circular dependency', {
        'keys': _pi.List<string>,
    }]
    | ['no such entry', {
        'key': string,
    }]
    | ['no context lookup', null]
    | ['missing denseness entry', {
        'key': string,
    }]
    | ['index out of bounds', {
        'up steps taken': number,
    }]
    | ['no element found at index', {
        'index': number,
    }]

export const abort = <Source>(location: Source, type: Resolve_Error_Type, location_to_string: Location_to_String<Source>): never => {
    return panic(
        sg(type, ($) => {
            switch ($[0]) {
                case 'no such entry': return ss($, ($) => `no such entry: '${$['key']}'`)
                case 'missing denseness entry': return ss($, ($) => `missing denseness entry: '${$['key']}'`)
                case 'circular dependency': return ss($, ($) => {
                    const keys = $.keys.__l_map(($) => ` '${$}', `)
                    return `circular dependency: (${keys})`
                })
                case 'no context lookup': return ss($, ($) => `no context lookup`)
                case 'index out of bounds': return ss($, ($) => `index out of bounds, ${$['up steps taken']}`)
                case 'no element found at index': return ss($, ($) => `no element found at index, ${$['index']}`)
                default: return au($[0])
            }
        }),
        ` @ ${location_to_string(location)}`
    )
}

export const dictionary_to_lookup = <T>(
    $: _pi.Dictionary<T>,
    $p: null,
): Acyclic_Lookup<T> => {
    return initialize.optional.set($.__d_map(($): Non_Circular_Result<T> => (['resolved', $])))
}

export const get_possibly_circular_dependent_sibling_entry = <Source, T>(
    $: Cyclic_Lookup<T>,
    $p: {
        'reference': unresolved$.Reference_To_Circular_Dependent_Sibling<Source, T>,
        'location 2 string': Location_to_String<Source>
    },
): resolved$.Reference_To_Circular_Dependent_Sibling<Source, T> => {
    return $.__decide(
        ($) => ({
            'key': $p.reference.key,
            'entry': $.__get_possible_entry($p.reference.key).__decide(
                ($) => $,
                () => abort($p.reference.location, ['no such entry', { 'key': $p.reference.key }], $p['location 2 string']),
            )
        }),
        () => abort($p.reference.location, ['no context lookup', null], $p['location 2 string'])
    )
}

export const push_stack = <T extends initialize.list.NonUndefined>($: _pi.List<T>, $p: { 'element': T }): _pi.List<T> => {
    return initialize.list.nested_literal_old([
        $,
        [
            $p.element
        ]
    ])
}


export const get_entry_from_stack = <Source, T>(
    $: Lookup_Stack<T>,
    $p: {
        'reference': unresolved$.Reference_To_Stacked_Dictionary_Entry<Source, T>,
        'location 2 string': Location_to_String<Source>
    },
): resolved$.Reference_To_Stacked_Dictionary_Entry<Source, T> => {
    const ref = $p.reference
    const get_entry_from_stack = (
        up_steps_taken: number
    ): resolved$.Reference_To_Stacked_Dictionary_Entry<Source, T> => {
        return $.__get_possible_element_at($.__get_number_of_elements() - 1 - up_steps_taken).__decide(
            ($): resolved$.Reference_To_Stacked_Dictionary_Entry<Source, T> => {
                return $.__decide(
                    ($) => {
                        return $.__get_possible_entry(ref.key).__decide(
                            ($) => sg($, ($) => {
                                switch ($[0]) {
                                    case 'error': return ss($, ($) => get_entry_from_stack(up_steps_taken += 1))
                                    case 'resolved': return ss($, ($): resolved$.Reference_To_Stacked_Dictionary_Entry<Source, T> => ({
                                        'key': ref.key,
                                        'up steps': up_steps_taken,
                                        'entry': $,
                                    }))
                                    default: return au($[0])
                                }
                            }),
                            () => panic(`no clue yet of what is happening here`),
                        )
                    },
                    () => abort(ref.location, ['index out of bounds', { 'up steps taken': up_steps_taken }], $p['location 2 string']),
                )
            },
            () => abort(ref.location, ['no element found at index', { 'index': up_steps_taken }], $p['location 2 string'])
        )
    }

    return get_entry_from_stack(0)
}

export const get_entry = <Source, T>(
    $: Acyclic_Lookup<T>,
    $p: {
        'reference': unresolved$.Reference_To_Normal_Dictionary_Entry<Source, T>,
        'location 2 string': Location_to_String<Source>
    },
): resolved$.Reference_To_Normal_Dictionary_Entry<Source, T> => {
    return $.__decide(
        ($) => ({
            'key': $p.reference.key,
            'entry': $.__get_possible_entry($p.reference.key).__decide(
                ($) => sg($, ($) => {
                    switch ($[0]) {
                        case 'error': return ss($, ($) => sg($, ($) => {
                            switch ($[0]) {
                                case 'circular': return ss($, ($) => {
                                    return abort($p.reference.location, ['circular dependency', { 'keys': $ }], $p['location 2 string'])
                                })
                                default: return au($[0])
                            }
                        }))
                        case 'resolved': return ss($, ($) => $)
                        default: return au($[0])
                    }
                }),
                () => {
                    return abort($p.reference.location, ['no such entry', { 'key': $p.reference.key }], $p['location 2 string'])
                }
            )
        }),
        () => abort($p.reference.location, ['no context lookup', null], $p['location 2 string'])
    )
}

export const resolve_path = <Source, Unresolved_Element, Resolved_Element extends initialize.list.NonUndefined, Seed>(
    $: unresolved$.List<Source, Unresolved_Element>,
    $p: {
        'seed': Seed
        'map': ($: Unresolved_Element, current: Seed) => Resolved_Step<Resolved_Element, Seed>
    },
): Path<Source, Resolved_Element, Seed> => {
    let current: Path<Source, Resolved_Element, Seed> = {
        'list': list_literal([]),
        'result': {
            'data': $p.seed,
        },
    }
    $.list.__for_each(($) => {
        const result = $p.map($.element, current.result.data)

        current = {
            'list': initialize.list.nested_literal_old([
                current.list,
                [
                    result.element
                ]
            ]),
            'result': {
                'data': result.result,
            }
        }
    })
    return current
}

export const resolve_dictionary = <Source, TUnresolved, TResolved>(
    $: unresolved$.Dictionary<Source, TUnresolved>,
    $p: {
        'map': ($: Key_Value_Location_Triplet<Source, TUnresolved>, $l: {
            'possibly circular dependent siblings': Cyclic_Lookup<TResolved>
        }) => TResolved,
        'location 2 string': ($: Source) => string
    }
): resolved$.Dictionary<Source, TResolved> => {
    return resolve_ordered_dictionary($, $p).dictionary
}


export const resolve_dense_dictionary = <Source, TUnresolved, TResolved, TBenchmark>(
    $: unresolved$.Dictionary<Source, TUnresolved>,
    $p: {
        'denseness benchmark': _pi.Dictionary<TBenchmark>
        'map': ($: Key_Value_Location_Triplet<Source, TUnresolved>, $l: {
            'possibly circular dependent siblings': Cyclic_Lookup<TResolved>
        }) => TResolved,
        'location 2 string': ($: Source) => string
    }
): resolved$.Dictionary<Source, TResolved> => {
    return resolve_dense_ordered_dictionary($, $p).dictionary
}

export const resolve_dense_ordered_dictionary = <Source, TUnresolved, TResolved, TBenchmark>(
    $: unresolved$.Dictionary<Source, TUnresolved>,
    $p: {
        'denseness benchmark': _pi.Dictionary<TBenchmark>
        'map': ($: Key_Value_Location_Triplet<Source, TUnresolved>, $l: {
            'possibly circular dependent siblings': Cyclic_Lookup<TResolved>
            'not circular dependent siblings': Acyclic_Lookup<TResolved>
        }) => TResolved,
        'location 2 string': ($: Source) => string
    }
): resolved$.Ordered_Dictionary<Source, TResolved> => {
    const location = $.location
    const result = resolve_ordered_dictionary($, $p)
    $p['denseness benchmark'].__d_map(($) => {
        const validate_denseness = (
            benchmark: _pi.Dictionary<TBenchmark>,
            focus: _pi.Dictionary<TResolved>,
            location: Source,
            location_to_string: Location_to_String<Source>,
        ) => {
            benchmark.__d_map(($, key) => {
                const benchmark = $
                focus.__get_possible_entry(key).__decide(
                    ($) => {
                    },
                    () => {
                        abort(location, ['missing denseness entry', { 'key': key }], $p['location 2 string'])
                    }
                )
            })
        }

        validate_denseness(
            $p['denseness benchmark'],
            result.dictionary,
            location,
            $p['location 2 string'],

        )
    })
    return result
}

export const resolve_ordered_dictionary = <Source, TUnresolved, TResolved>(
    $: unresolved$.Dictionary<Source, TUnresolved>,
    $p: {
        'map': ($: Key_Value_Location_Triplet<Source, TUnresolved>, $l: {
            'possibly circular dependent siblings': Cyclic_Lookup<TResolved>
            'not circular dependent siblings': Acyclic_Lookup<TResolved>
        }) => TResolved,
        'location 2 string': ($: Source) => string
    }
): resolved$.Ordered_Dictionary<Source, TResolved> => {
    const dictionary_location = $.location
    /**
     * this variable contains all the entries on which siblings have subscribed 
     */
    const all_siblings_subscribed_entries: {
        [key: string]: {
            entry: TResolved | null
        }
    } = {}

    const finished: { [key: string]: TResolved } = {}

    type Key_Value_Pair<T> = {
        'key': string,
        'value': T,
    }

    const ordered_list = initialize.list.deprecated_build<Key_Value_Pair<TResolved>>(($i) => {

        const source_dictionary = $

        const status_dictionary: {
            [key: string]:
            | ['processing', null]
            | ['failed', null]
            | ['success', TResolved]
        } = {}

        function process_entry($: TUnresolved, location: Source, key_of_entry_being_processed: string) {
            status_dictionary[key_of_entry_being_processed] = ['processing', null]
            const entry = $p.map({
                'key': key_of_entry_being_processed,
                'value': $,
                'location': location,
            }, {
                'possibly circular dependent siblings': initialize.optional.set({
                    __get_possible_entry(key) {
                        //does the entry exist?
                        return source_dictionary.dictionary.__get_possible_entry(key).__o_map(($) => {
                            //yes, it exists in the source dictionary
                            if (all_siblings_subscribed_entries[key] === undefined) {
                                all_siblings_subscribed_entries[key] = { 'entry': null }
                            }
                            const subscr = all_siblings_subscribed_entries[key]
                            return {
                                'get circular dependent': () => {
                                    if (subscr.entry === null) {
                                        return panic(`entry not set: ${key}`)
                                    }
                                    return subscr.entry
                                }
                            }

                        })
                    },

                }),
                'not circular dependent siblings': initialize.optional.set({
                    __get_possible_entry(key): _pi.Optional_Value<Non_Circular_Result<TResolved>> {
                        const status = status_dictionary[key]
                        if (status === undefined) {
                            return source_dictionary.dictionary.__get_possible_entry(key).__decide(
                                ($) => initialize.optional.set(['resolved', process_entry($.entry, $.location, key)]),
                                () => {
                                    return initialize.optional.not_set()
                                    // throw new ResolveError("")
                                }
                            )
                        } else {
                            const get_keys_of_entries_being_processed = () => {
                                return initialize.list.deprecated_build<string>(($i) => {
                                    dictionary_literal(status_dictionary).__d_map(($, key) => {
                                        if ($[0] === 'processing') {
                                            $i['add element'](key)
                                        }
                                    })

                                })
                            }
                            return sg(status, (s) => {
                                switch (s[0]) {
                                    case 'failed':
                                        return ss(s, (s) => {
                                            //nothing to report





                                            return initialize.optional.set(['error', ['circular', get_keys_of_entries_being_processed()]])
                                            //return notSet()
                                        })
                                    case 'processing':
                                        if (key === key_of_entry_being_processed) {
                                            //$se.onError(`'${key}' is referencing itself`)
                                        } else {
                                            // const keys: string[] = []
                                            // Object.keys(status_dictionary).forEach((key) => {
                                            //     if (status_dictionary[key][0] === 'processing') {
                                            //         keys.push(key)
                                            //     }
                                            // })
                                            //$se.onError(`the following entries are referencing each other: ${keys.join(", ")}`)
                                        }
                                        status_dictionary[key_of_entry_being_processed] = ['failed', null]
                                        return initialize.optional.set(['error', ['circular', get_keys_of_entries_being_processed()]])

                                    case 'success':
                                        return initialize.optional.set(['resolved', s[1]])
                                    default: return au(s[0])
                                }
                            })
                        }
                    },
                }),
            })
            finished[key_of_entry_being_processed] = entry
            $i['add element']({
                'key': key_of_entry_being_processed,
                'value': entry,
            })
            status_dictionary[key_of_entry_being_processed] = ['success', entry]
            return entry
        }

        $.dictionary.__d_map(($, key) => {
            if (status_dictionary[key] === undefined) {
                process_entry($.entry, $.location, key)
            }
        })
        dictionary_literal(all_siblings_subscribed_entries).__d_map(($, key) => {
            if (finished[key] === undefined) {
                panic(`implementation error: entry not resolved: ${key}`)
            }
            all_siblings_subscribed_entries[key].entry = finished[key]
        })
    })
    return {
        'dictionary': dictionary_literal(finished),
        'ordered list': ordered_list,
    }
}