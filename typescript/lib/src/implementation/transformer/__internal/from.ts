import * as p_di from "../../../interface/data"
import * as p_ti from "../../../interface/transformer"
import { Dictionary_Class } from "../../__internal/sync/primitives/Dictionary"
import { Abort } from "../../../interface/__internal/Abort"
import * as lit from "../../__internal/sync/literal"

export const boolean = (
    boolean_value: boolean,
) => {
    return {

        convert_to_optional: <T extends p_di.Value>(
            assign_set: () => T,
        ): p_di.Optional_Value<T> => {
            if (boolean_value) {
                return lit.set<T>(assign_set())
            } else {
                return lit.not_set<T>()
            }
        },

        decide: <RT>(
            if_true: () => RT,
            if_false: () => RT
        ): RT => boolean_value
                ? if_true()
                : if_false()

    }
}

export const dictionary = <T extends p_di.Value>(
    dictionary: p_di.Dictionary<T>,
) => {
    return {

        amount_of_entries: (
        ): number => {
            return dictionary.__get_raw_copy().length
        },

        convert_to_list: <New_Type extends p_di.Value>(
            assign_item: (
                value: T,
                id: string
            ) => New_Type
        ): p_di.List<New_Type> => {
            return lit.list(dictionary.__get_raw_copy().map(($) => assign_item($[1], $[0])))
        },

        filter: (
            callback: (
                value: T,
                id: string
            ) => boolean
        ): p_di.Dictionary<T> => new Dictionary_Class(dictionary.__get_raw_copy().filter(($) => callback($[1], $[0]))),

        flatten: <New_Type extends p_di.Value>(
            get_child_dictionary: (
                value: T
            ) => p_di.Dictionary<New_Type>,
            get_id: (
                parent_id: string,
                child_id: string,
            ) => string,
            abort: {
                duplicate_id: Abort<string>
            }
        ) => {
            const out: { [id: string]: New_Type } = {}

            dictionary.__get_raw_copy().forEach(($) => {
                const id = $[0]
                const value = $[1]
                const child_dictionary = get_child_dictionary(value)
                child_dictionary.__get_raw_copy().forEach(($) => {
                    const child_id = $[0]
                    const child_value = $[1]
                    const combined_id = get_id(id, child_id)
                    if (out[combined_id] !== undefined) {
                        abort.duplicate_id(combined_id)
                    }
                    out[combined_id] = child_value
                })
            })
            return lit.dictionary(out)
        },

        flatten_to_list: <NT extends p_di.Value>(
            assign_item: (
                value: T,
                id: string
            ) => p_di.List<NT>,
        ): p_di.List<NT> => {
            const out: NT[] = []
            dictionary.__get_raw_copy().forEach(($) => {
                const entry = $
                const innerList = assign_item(entry[1], entry[0])
                innerList.__get_raw_copy().forEach(($) => {
                    out.push($)
                })

            })
            return lit.list(out)
        },

        group: (
            get_id: (
                value: T,
                id: string
            ) => string,
        ): p_di.Dictionary<p_di.Dictionary<T>> => {
            const temp: { [id: string]: { [id: string]: T } } = {}
            dictionary.__get_raw_copy().forEach(($) => {
                const id = $[0]
                const value = $[1]
                const group_id = get_id(value, id)
                if (temp[group_id] === undefined) {
                    temp[group_id] = {}
                }
                temp[group_id][id] = value
            })
            return lit.dictionary(temp).__d_map_deprecated(($) => lit.dictionary($))
        },

        is_empty: (): boolean => {
            return dictionary.__get_raw_copy().length === 0
        },

        join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
            other_dictionary: p_di.Dictionary<Other_Type>,
            assign_entry: (
                value: T,
                other_value: p_di.Optional_Value<Other_Type>,
                id: string
            ) => Result,
        ) => {
            const out: { [id: string]: Result } = {}
            dictionary.__get_raw_copy().forEach(($) => {
                const id = $[0]
                const value = $[1]
                out[id] = assign_entry(
                    value,
                    other_dictionary.__get_possible_entry_deprecated(
                        id,
                    ),
                    id
                )
            })
            return lit.dictionary(out)
        },

        map: <New_Type extends p_di.Value>(
            assign_entry: (
                value: T,
                id: string
            ) => New_Type,
        ): p_di.Dictionary<New_Type> => dictionary.__d_map_deprecated(assign_entry),

        map_optionally: <New_Type extends p_di.Value>(
            assign_optional_entry: (
                value: T,
                id: string
            ) => p_di.Optional_Value<New_Type>
        ): p_di.Dictionary<New_Type> => {
            return new Dictionary_Class(
                dictionary
                    .__get_raw_copy()
                    .map(($) => [$[0], assign_optional_entry($[1], $[0])] as [string, p_di.Optional_Value<New_Type>])
                    .filter(($) => $[1].__get_raw() !== null)
                    .map(($) => [$[0], $[1].__get_raw()![0]])
            )
        },

        on_contains_entry: <RT extends p_di.Value>(
            id: string,
            if_true: ($: T) => RT,
            if_not_true: () => RT
        ): RT => dictionary.__get_possible_entry_deprecated(id).__decide(
            ($) => if_true($),
            () => if_not_true(),
        ),

        on_has_entries: <RT extends p_di.Value>(
            if_true: ($: p_di.Dictionary<T>) => RT,
            if_not_true: () => RT
        ): RT => dictionary.__get_raw_copy().length !== 0
                ? if_true(dictionary)
                : if_not_true(),

        on_has_single_entry: <RT extends p_di.Value>(
            if_true: ($: T, id: string) => RT,
            if_multiple: ($: p_di.Dictionary<T>) => RT,
            if_none: () => RT,
        ): RT => {
            return list(lit.list(dictionary.__get_raw_copy().map(($) => ({ 'id': $[0], 'value': $[1] })))).on_has_single_item(
                (item) => if_true(item.value, item.id),
                () => if_multiple(dictionary),
                if_none,
            )
        },

        re_id: (
            get_id: ($: T, key: string) => string,
            abort: {
                duplicate_id: (value: T, id: string) => never
            }
        ) => {
            const temp: { [id: string]: T } = {}
            dictionary.__get_raw_copy().forEach(($) => {
                const id = $[0]
                const value = $[1]
                const new_id = get_id(value, id)
                if (temp[new_id] !== undefined) {
                    abort.duplicate_id(value, new_id)
                }
                temp[new_id] = value
            })
            return lit.dictionary(temp)
        },

        resolve: <Resolved extends p_di.Value>(
            assign_entry: (
                value: T,
                id: string,
                acyclic_lookup: p_ti.lookup.Acyclic<Resolved>,
                cyclic_lookup: p_ti.lookup.Cyclic<Resolved>,
            ) => Resolved,
        ): p_di.Dictionary<Resolved> => {
            const source = dictionary
            const out: { [id: string]: Resolved } = {}

            const entries_started: { [id: string]: null } = {}

            type Cyclic_Reference = {
                'id': string,
                'value': undefined | p_di.Optional_Value<Resolved>,
                'exception': {
                    accessing_cyclic_sibling_before_it_is_resolved: p_ti.lookup.Exception_Callback<Resolved, null>,
                }
            }

            const cyclic_references: Cyclic_Reference[] = []

            const inner_resolve = (
                value: T,
                id: string,
                stack: string[]
            ): undefined => {
                if (out[id] !== undefined) {
                    // already resolved
                    return
                }
                entries_started[id] = null
                out[id] = assign_entry(
                    value,
                    id,
                    {
                        get_entry: (
                            id,
                            exception,
                        ) => {
                            let no_such_entry: boolean = false
                            if (out[id] === undefined) {
                                if (entries_started[id] !== undefined) {
                                    return exception['cycle_detected'](lit.list(stack.concat([id])))
                                } else {
                                    source.__get_possible_entry_deprecated(
                                        id
                                    ).__extract_data(
                                        ($) => {
                                            inner_resolve(
                                                $,
                                                id,
                                                stack.concat([id])
                                            )
                                            no_such_entry = false
                                        },
                                        () => {
                                            no_such_entry = true
                                        }
                                    )
                                }

                            }
                            // now it must be resolved, otherwise we would have aborted
                            if (no_such_entry) {
                                return lit.not_set()
                            } else {
                                return lit.set(out[id])
                            }
                        },
                        // __get_entry_raw: (
                        //     id,
                        //     abort,
                        // ) => {
                        //     const x = source.__get_entry_raw(id)
                        //     if (x === null) {
                        //         return null
                        //     } else {
                        //         if (out[id] === undefined) {
                        //             if (entries_started[id] !== undefined) {
                        //                 return abort.cycle_detected(lit.list(stack.concat([id])))
                        //             } else {
                        //                 inner_resolve(
                        //                     x[0],
                        //                     id,
                        //                     stack.concat([id])
                        //                 )
                        //             }
                        //         }
                        //         // now it must be resolved, otherwise we would have aborted
                        //         return [out[id]]

                        //     }
                        // }
                    },
                    {
                        get_entry: (
                            id,
                            exception,
                        ) => {
                            const temp_reference: Cyclic_Reference = {
                                'id': id,
                                'value': undefined,
                                'exception': exception,
                            }
                            cyclic_references.push(temp_reference)
                            return {
                                get_circular_dependent: () => {
                                    if (temp_reference.value === undefined) {
                                        return exception.accessing_cyclic_sibling_before_it_is_resolved(null)
                                    } else {
                                        return temp_reference.value
                                    }
                                }
                            }
                        }
                    }
                )
            }
            source.__get_raw_copy().forEach(($) => {
                const id = $[0]
                const value = $[1]
                inner_resolve(value, id, [id])
            })

            cyclic_references.forEach(($) => {
                const value = out[$.id]
                if (value === undefined) {
                    $.value = lit.not_set()
                } else {
                    $.value = lit.set(value)
                }

            })

            return lit.dictionary(out)
        },

        sum: (
            assign_value: (
                item: T,
            ) => number,
        ): number => {
            let sum = 0
            dictionary.__get_raw_copy().forEach(($) => {
                sum += assign_value($[1])
            })
            return sum
        },
    }
}

export const list = <T extends p_di.Value>(
    list: p_di.List<T>,
) => {
    return {

        amount_of_items: (
        ): number => {
            return list.__get_raw_copy().length
        },

        convert_to_dictionary: <NT extends p_di.Value>(
            get_id: (
                item: T
            ) => string,
            get_value: (
                item: T
            ) => NT,
            abort: {
                duplicate_id: Abort<string>
            }
        ): p_di.Dictionary<NT> => {
            const temp: { [id: string]: NT } = {}
            list.__get_raw_copy().forEach(($) => {
                const id = get_id($)
                if (temp[id] !== undefined) {
                    abort.duplicate_id(id)
                }
                temp[id] = get_value($)
            })
            return lit.dictionary(temp)
        },


        filter: (
            callback: (
                item: T,
            ) => boolean
        ): p_di.List<T> => {
            return lit.list(list.__get_raw_copy().filter(callback))
        },

        flatten: <NT extends p_di.Value>(
            assign_list: (
                $: T
            ) => p_di.List<NT>,
        ): p_di.List<NT> => {
            const out: NT[] = []
            list.__get_raw_copy().forEach(($) => {
                const innerList = assign_list($)
                innerList.__get_raw_copy().forEach(($) => {
                    out.push($)
                })

            })
            return lit.list(out)
        },

        full_join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
            other_list: p_di.List<Other_Type>,
            assign_item: (
                value: p_di.Optional_Value<T>,
                other_value: p_di.Optional_Value<Other_Type>,
            ) => Result,
        ) => {
            const out: Result[] = []
            const maxLength = Math.max(
                list.__get_raw_copy().length,
                other_list.__get_raw_copy().length
            )
            for (let i = 0; i < maxLength; i++) {
                out.push(assign_item(
                    list.__deprecated_get_possible_item_at(i),
                    other_list.__deprecated_get_possible_item_at(i),
                ))
            }
            return lit.list(out)
        },

        group: (
            get_id: (
                item: T
            ) => string,
        ): p_di.Dictionary<p_di.List<T>> => {
            const temp: { [id: string]: T[] } = {}
            list.__get_raw_copy().forEach(($) => {
                const id = get_id($)
                if (temp[id] === undefined) {
                    temp[id] = []
                }
                temp[id].push($)
            })
            const temp2: { [id: string]: p_di.List<T> } = {}
            Object.keys(temp).forEach((id) => {
                temp2[id] = lit.list(temp[id])
            })
            return lit.dictionary(temp2)
        },

        is_empty: (): boolean => {
            return list.__get_raw_copy().length === 0
        },

        join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
            other_list: p_di.List<Other_Type>,
            assign_item: (
                value: T,
                other_value: p_di.Optional_Value<Other_Type>,
            ) => Result,
        ) => {
            const out: Result[] = []
            let index = -1
            list.__get_raw_copy().forEach(
                ($) => {
                    index++
                    out.push(assign_item(
                        $,
                        other_list.__deprecated_get_possible_item_at(index),
                    ))
                })
            return lit.list(out)
        },

        map: <New_Type extends p_di.Value>(
            assign_item: (
                item: T,
            ) => New_Type,
        ): p_di.List<New_Type> => {
            return list.__l_map_deprecated(assign_item)
        },

        map_optionally: <New_Type extends p_di.Value>(
            assign_optional_item: (
                item: T,
            ) => p_di.Optional_Value<New_Type>
        ): p_di.List<New_Type> => {
            const out: New_Type[] = []
            list.__get_raw_copy().forEach(($) => {
                const result = assign_optional_item($)
                result.__extract_data(
                    ($) => {
                        out.push($)
                    },
                    () => { }
                )
            })
            return lit.list(out)
        },

        map_with_index: <New_Type extends p_di.Value>(
            assign_item: (
                item: T,
                index: number
            ) => New_Type,
        ): p_di.List<New_Type> => {

            return lit.list(list.__get_raw_copy().map(($, index) => assign_item($, index)))
        },

        map_with_state: <
            Target_Item extends p_di.Value,
            State,
            Result_Type extends { [id: string]: p_di.Value }
        >(
            initial_state: State,
            assign_item: (
                item: T,
                state: State
            ) => Target_Item,
            update_state: (
                item: Target_Item,
                state: State
            ) => State,
            wrapup: (
                final_list: p_di.List<Target_Item>,
                final_state: State
            ) => Result_Type,
        ): Result_Type => {
            let current_state = initial_state
            return wrapup(
                list.__l_map_deprecated(($) => {
                    const result = assign_item($, current_state)
                    current_state = update_state(result, current_state)
                    return result
                }),
                current_state
            )
        },

        on_has_first_item: <RT extends p_di.Value>(
            if_true: ($: T, rest: p_di.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__deprecated_get_possible_item_at(0).__decide(
            ($) => if_true($, lit.list(list.__get_raw_copy().slice(1))),
            () => if_not_true(),
        ),

        on_has_items: <RT extends p_di.Value>(
            if_true: ($: p_di.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__get_raw_copy().length !== 0
                ? if_true(list)
                : if_not_true(),

        on_has_last_item: <RT extends p_di.Value>(
            if_true: ($: T, rest: p_di.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__deprecated_get_possible_item_at(list.__get_raw_copy().length - 1).__decide(
            ($) => if_true($, lit.list(list.__get_raw_copy().slice(0, -1))),
            () => if_not_true(),
        ),

        /**
         * sequentially tests each item in the list with the provided test function. If a match is found, it returns the result of the test function. If no match is found, it returns the result of the if_no_match function.
         */
        on_has_match: <RT extends p_di.Value>(
            test: ($: T) => p_di.Optional_Value<RT>,
            if_no_match: () => RT,
        ): RT => {
            const raw = list.__get_raw_copy()
            for (let i = 0; i < raw.length; i++) {
                const item = raw[i]
                const result = test(item).__get_raw()
                if (result !== null) {
                    return result[0]
                }
            }
            return if_no_match()
        },

        on_has_single_item: <RT extends p_di.Value>(
            if_true: ($: T) => RT,
            if_multiple: ($: p_di.List<T>) => RT,
            if_none: () => RT,
        ): RT => {
            return (list.__get_raw_copy().length > 1)
                ? if_multiple(list)
                : list.__deprecated_get_possible_item_at(0).__decide(
                    ($) => if_true($),
                    () => if_none(),
                )
        },

        sum: (
            assign_value: (
                item: T,
            ) => number,
        ): number => {
            let sum = 0
            list.__get_raw_copy().forEach(($) => {
                sum += assign_value($)
            })
            return sum
        },

        reduce_to_boolean: (
            initial_state: boolean,
            update_state: (
                value: T,
                current: boolean
            ) => boolean,
        ): boolean => {
            let current_state = initial_state
            list.__get_raw_copy().forEach(($) => {
                current_state = update_state($, current_state)
            })
            return current_state
        },

        reduce_to_number: (
            initial_state: number,
            update_state: (
                value: T,
                current: number
            ) => number,
        ): number => {
            let current_state = initial_state
            list.__get_raw_copy().forEach(($) => {
                current_state = update_state($, current_state)
            })
            return current_state
        },

        reverse: (
        ): p_di.List<T> => {
            return lit.list(list.__get_raw_copy().slice().reverse())
        },


    }
}



export const number = (
    number: number,
) => {
    return {


        /**
         * Performs integer division of two numbers with configurable rounding behavior.
         * 
         * dividend / divisor
         * 
         * Rounding modes:
         * - 'towards negative infinity': floor (7.8 → 7, -7.8 → -8)
         * - 'towards positive infinity': ceiling (7.2 → 8, -7.8 → -7)
         * - 'towards zero': truncate (7.8 → 7, -7.8 → -7)
         * - 'towards nearest': round to nearest integer (7.5 → 8, 7.4 → 7)
         * - 'away from zero': round away from zero (7.2 → 8, -7.2 → -8)
         */
        divide: (
            divisor: number,
            round:
                | ['towards negative infinity', null]
                | ['towards positive infinity', null]
                | ['towards nearest', null]
                | ['towards zero', null]
                | ['away from zero', null],
            abort: {
                divided_by_zero: Abort<null>
            },
        ): number => {
            if (divisor === 0) {
                abort.divided_by_zero(null)
            }
            const quotient = number / divisor

            switch (round[0]) {
                case 'towards negative infinity':
                    // Always round down (floor)
                    return Math.floor(quotient)

                case 'towards positive infinity':
                    // Always round up (ceiling)
                    return Math.ceil(quotient)

                case 'towards zero':
                    // Truncate decimal part (round towards zero)
                    return Math.trunc(quotient)

                case 'towards nearest':
                    // Round to nearest integer (0.5 rounds away from zero)
                    return Math.round(quotient)

                case 'away from zero':
                    // Round away from zero
                    if (quotient >= 0) {
                        return Math.ceil(quotient)
                    } else {
                        return Math.floor(quotient)
                    }

                default:
                    const _exhaustiveCheck: never = round
                    throw new Error(`Unexpected rounding mode: ${round}`)
            }
        },



        repeat: <T extends p_di.Value>(
            item: T,
        ): p_di.List<T> => {
            const out: T[] = []
            for (let i = 0; i < number; i++) {
                out.push(item)
            }
            return lit.list(out)
        }


    }
}

export const optional = <T extends p_di.Value>(
    optional_value: p_di.Optional_Value<T>,
) => {
    return {

        decide: <RT extends p_di.Value>(
            if_set: ($: T) => RT,
            if_not_set: () => RT
        ): RT => optional_value.__decide(if_set, if_not_set),

        is_set: (): boolean => {
            return optional_value.__decide(
                () => true,
                () => false
            )
        },

        map: <New_Type extends p_di.Value>(
            assign_set_value: (
                value: T
            ) => New_Type,
        ): p_di.Optional_Value<New_Type> => {
            return optional_value.__decide(
                (value): p_di.Optional_Value<New_Type> => lit.set<New_Type>(assign_set_value(value)),
                () => lit.not_set<New_Type>()
            )
        },

    }
}



export const state = <State extends p_di.State>(
    state: State,
) => {
    return {

        decide: <RT extends p_di.Value>(
            assign: (output: State) => RT
        ): RT => {
            return assign(state)
        }

    }
}

export const text = (
    string: string,
) => {
    return {


    }
}