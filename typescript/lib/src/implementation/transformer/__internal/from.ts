import * as p_di from "../../../interface/data"
import * as p_ti from "../../../interface/transformer"
import { Dictionary_Class } from "../../__internal/sync/primitives/Dictionary"
import { Abort } from "../../../interface/__internal/Abort"
import * as lit from "../../__internal/sync/literal"

export const boolean = (
    boolean_value: boolean,
) => {
    return {

        decide: <RT>(
            if_true: () => RT,
            if_false: () => RT
        ): RT => boolean_value
                ? if_true()
                : if_false()
    }
}

export const dictionary = <T extends p_di.Value>(
    dict: p_di.Dictionary<T>,
) => {
    return {

        amount_of_entries: (
        ): number => {
            return dict.__get_raw().length
        },

        convert_to_list: <New_Type extends p_di.Value>(
            assign_item: (
                value: T,
                id: string
            ) => New_Type
        ): p_di.List<New_Type> => {
            return lit.list(dict.__get_raw().map(([id, value]) => assign_item(value, id)))
        },

        filter: (
            callback: (
                value: T,
                id: string
            ) => boolean
        ): p_di.Dictionary<T> => new Dictionary_Class(dict.__get_raw().filter(([id, value]) => callback(value, id))),

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

            dict.__get_raw().forEach(([id, value]) => {
                const child_dictionary = get_child_dictionary(value)
                child_dictionary.__get_raw().forEach(([child_id, child_value]) => {
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
            dict.__get_raw().forEach(([id, value]) => {
                const innerList = assign_item(value, id)
                innerList.__get_raw().forEach(($) => {
                    out.push($)
                })

            })
            return lit.list(out)
        },

        get_possible_entry<RT extends p_di.Value>(
            id: string,
            if_set: ($: T) => RT,
            if_not_set: () => RT
        ): RT {
            const raw = dict.__get_raw()
            for (let i = 0; i !== raw.length; i += 1) {
                const [entry_id, entry_value] = raw[i]
                if (entry_id === id) {
                    return if_set(entry_value)
                }
            }
            return if_not_set()
        },

        group: <RT extends p_di.Value>(
            get_id: (
                value: T,
                id: string
            ) => string,
            aggregate: ($: p_di.Dictionary<T>, group_id: string) => RT
        ): p_di.Dictionary<RT> => {
            const temp: { [id: string]: [string, T][] } = {}
            dict.__get_raw().forEach(([id, value]) => {
                const group_id = get_id(value, id)
                if (temp[group_id] === undefined) {
                    temp[group_id] = []
                }
                temp[group_id].push([id, value])
            })
            const temp2: { [id: string]: RT } = {}
            Object.keys(temp).forEach((group_id) => {
                temp2[group_id] = aggregate(new Dictionary_Class(temp[group_id]), group_id)
            })
            return lit.dictionary(temp2)
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
            dict.__get_raw().forEach(([id, value]) => {
                out[id] = assign_entry(
                    value,
                    dictionary(other_dictionary).get_possible_entry(
                        id,
                        (x) => lit.set(x),
                        () => lit.not_set()
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
        ): p_di.Dictionary<New_Type> => {

            //this local function helps with type inference
            const temp_d_map = <NT extends p_di.Value>(
                mapper: (value: T, id: string) => NT
            ): p_di.Dictionary<NT> => {
                return new Dictionary_Class<NT>(dict.__get_raw().map(([id, value]) => {
                    return [
                        id,
                        mapper(value, id)
                    ]
                }))
            }

            return temp_d_map(assign_entry)
        },

        map_optionally: <New_Type extends p_di.Value>(
            assign_optional_entry: (
                value: T,
                id: string
            ) => p_di.Optional_Value<New_Type>
        ): p_di.Dictionary<New_Type> => new Dictionary_Class(
            dict
                .__get_raw()
                .map(([id, value]): [string, p_di.Optional_Value<New_Type>] => [id, assign_optional_entry(value, id)])
                .filter(([_, optional]) => optional.__get_raw() !== null)
                .map(([id, optional]) => [id, optional.__get_raw()![0]])
        ),

        on_has_entries: <RT extends p_di.Value>(
            if_true: ($: p_di.Dictionary<T>) => RT,
            if_not_true: () => RT
        ): RT => dict.__get_raw().length !== 0
                ? if_true(dict)
                : if_not_true(),

        on_has_single_entry: <RT extends p_di.Value>(
            if_true: ($: T, id: string) => RT,
            if_multiple: ($: p_di.Dictionary<T>) => RT,
            if_none: () => RT,
        ): RT => list(lit.list(dict.__get_raw().map(([id, value]) => ({ 'id': id, 'value': value })))).on_has_single_item(
            (item) => if_true(item.value, item.id),
            () => if_multiple(dict),
            if_none,
        ),

        re_id: (
            get_id: ($: T, key: string) => string,
            abort: {
                duplicate_id: (value: T, id: string) => never
            }
        ): p_di.Dictionary<T> => {
            const temp: { [id: string]: T } = {}
            dict.__get_raw().forEach(([id, value]) => {
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
            const source = dict
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
                                    dictionary(source).get_possible_entry(
                                        id,
                                        ($) => {
                                            inner_resolve(
                                                $,
                                                id,
                                                stack.concat([id])
                                            )
                                            no_such_entry = false
                                            return null
                                        },
                                        () => {
                                            no_such_entry = true
                                            return null
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
            source.__get_raw().forEach(([id, value]) => {
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
            dict.__get_raw().forEach(([id, value]) => {
                sum += assign_value(value)
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
            return list.__get_raw().length
        },

        filter: (
            callback: (
                item: T,
            ) => boolean
        ): p_di.List<T> => {
            return lit.list(list.__get_raw().filter(callback))
        },

        flatten: <NT extends p_di.Value>(
            assign_list: (
                $: T
            ) => p_di.List<NT>,
        ): p_di.List<NT> => {
            const out: NT[] = []
            list.__get_raw().forEach(($) => {
                const innerList = assign_list($)
                innerList.__get_raw().forEach(($) => {
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
            const this_list_raw = list.__get_raw()
            const other_list_raw = other_list.__get_raw()
            const out: Result[] = []
            const maxLength = Math.max(
                this_list_raw.length,
                other_list_raw.length
            )
            for (let i = 0; i < maxLength; i++) {
                out.push(
                    assign_item(
                        i < this_list_raw.length
                            ? lit.set(this_list_raw[i])
                            : lit.not_set(),
                        i < other_list_raw.length
                            ? lit.set(other_list_raw[i])
                            : lit.not_set()
                    )
                )
            }
            return lit.list(out)
        },

        group: <RT extends p_di.Value>(
            get_id: (
                item: T
            ) => string,
            aggregate: ($: p_di.List<T>, group_id: string) => RT
        ): p_di.Dictionary<RT> => {
            const temp: { [id: string]: T[] } = {}
            list.__get_raw().forEach(($) => {
                const id = get_id($)
                if (temp[id] === undefined) {
                    temp[id] = []
                }
                temp[id].push($)
            })
            const temp2: { [id: string]: RT } = {}
            Object.keys(temp).forEach((id) => {
                temp2[id] = aggregate(lit.list(temp[id]), id)
            })
            return lit.dictionary(temp2)
        },

        join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
            other_list: p_di.List<Other_Type>,
            assign_item: (
                value: T,
                other_value: p_di.Optional_Value<Other_Type>,
            ) => Result,
        ): p_di.List<Result> => {
            const out: Result[] = []
            const other_list_raw = other_list.__get_raw()
            let index = -1
            list.__get_raw().forEach(
                ($) => {
                    index++
                    out.push(assign_item(
                        $,
                        index < other_list_raw.length
                            ? lit.set(other_list_raw[index])
                            : lit.not_set(),
                    ))
                }
            )
            return lit.list(out)
        },

        map: <New_Type extends p_di.Value>(
            assign_item: (
                item: T,
            ) => New_Type,
        ): p_di.List<New_Type> => {

            return lit.list(list.__get_raw().map((entry) => {
                return assign_item(entry)
            }))
        },

        map_optionally: <New_Type extends p_di.Value>(
            assign_optional_item: (
                item: T,
            ) => p_di.Optional_Value<New_Type>
        ): p_di.List<New_Type> => {
            const out: New_Type[] = []
            list.__get_raw().forEach(($) => {
                const raw = assign_optional_item($).__get_raw()
                if (raw !== null) {
                    out.push(raw[0])
                }
            })
            return lit.list(out)
        },

        map_with_index: <New_Type extends p_di.Value>(
            assign_item: (
                item: T,
                index: number
            ) => New_Type,
        ): p_di.List<New_Type> => {

            return lit.list(list.__get_raw().map(($, index) => assign_item($, index)))
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
                lit.list(list.__get_raw().map(($) => {
                    const result = assign_item($, current_state)
                    current_state = update_state(result, current_state)
                    return result
                })),
                current_state
            )
        },

        on_has_first_item: <RT extends p_di.Value>(
            if_true: ($: T, rest: p_di.List<T>) => RT,
            if_not_true: () => RT
        ): RT => {
            const list_raw = list.__get_raw()
            if (list_raw.length === 0) {
                return if_not_true()
            } else {
                return if_true(
                    list_raw[0],
                    lit.list(list_raw.slice(1))
                )
            }
        },

        on_has_items: <RT extends p_di.Value>(
            if_true: ($: p_di.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__get_raw().length !== 0
                ? if_true(list)
                : if_not_true(),

        on_has_last_item: <RT extends p_di.Value>(
            if_true: (
                $: T,
                rest: p_di.List<T>
            ) => RT,
            if_not_true: () => RT
        ): RT => {
            const list_raw = list.__get_raw()
            if (list_raw.length === 0) {
                return if_not_true()
            } else {
                return if_true(
                    list_raw[list_raw.length - 1],
                    lit.list(list_raw.slice(0, -1))
                )
            }
        },

        /**
         * sequentially tests each item in the list with the provided test function. If a match is found, it returns the result of the test function. If no match is found, it returns the result of the if_no_match function.
         */
        on_has_match: <RT extends p_di.Value>(
            test: ($: T) => p_di.Optional_Value<RT>,
            if_no_match: () => RT,
        ): RT => {
            const raw = list.__get_raw()
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
            const list_raw = list.__get_raw()
            if (list_raw.length === 0) {
                return if_none()
            } else if (list_raw.length === 1) {
                return if_true(list_raw[0])
            } else {
                return if_multiple(list)
            }
        },

        sum: (
            assign_value: (
                item: T,
            ) => number,
        ): number => {
            let sum = 0
            list.__get_raw().forEach(($) => {
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
            list.__get_raw().forEach(($) => {
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
            list.__get_raw().forEach(($) => {
                current_state = update_state($, current_state)
            })
            return current_state
        },

        reverse: (
        ): p_di.List<T> => {
            return lit.list(list.__get_raw().slice().reverse())
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
        ): RT => {
            const raw = optional_value.__get_raw()
            return raw === null
                ? if_not_set()
                : if_set(raw[0])
        },

        map: <New_Type extends p_di.Value>(
            assign_set_value: (
                value: T
            ) => New_Type,
        ): p_di.Optional_Value<New_Type> => {
            const raw = optional_value.__get_raw()
            return raw === null
                ? lit.not_set()
                : lit.set(assign_set_value(raw[0]))
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