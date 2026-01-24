import * as _pi from "../../../interface"

import { $$ as deprecated_get_location_info } from "../get_location_info"
import { $$ as dictionary_literal } from "./literals/dictionary"
import { $$ as list_literal } from "./literals/list"
import { set as optional_set, not_set as optional_not_set } from "./literals/optional"

export namespace boolean {

    export const dictionary_is_empty = <T>(
        $: _pi.Dictionary<T>,
    ): boolean => {
        return $.__get_number_of_entries() === 0
    }

    export const list_is_empty = <T>(
        $: _pi.List<T>,
    ): boolean => {
        return $.__get_number_of_elements() === 0
    }

}

export namespace dictionary {

    export const filter = <T, New_Type>(
        $: _pi.Dictionary<T>,
        handle_value: (
            value: T,
            id: string
        ) => _pi.Optional_Value<New_Type>
    ): _pi.Dictionary<New_Type> => {
        const out: { [id: string]: New_Type } = {}
        $.__d_map(($, id) => {
            const result = handle_value($, id)
            result.__extract_data(
                (new_value) => {
                    out[id] = new_value
                },
                () => { }
            )
        })
        return dictionary_literal(out)
    }

    export const from_list = <T, NT>(
        list: _pi.List<T>,
        get_key: (item: T) => string,
        get_value: (item: T) => NT,
        abort: _pi.Abort<['duplicate id in list to dictionary', null]>,
    ): _pi.Dictionary<NT> => {
        const temp: { [id: string]: NT } = {}
        list.__for_each(($) => {
            const id = get_key($)
            if (temp[id] !== undefined) {
                abort(['duplicate id in list to dictionary', null])
            }
            temp[id] = get_value($)
        })
        return dictionary_literal(temp)
    }

    export const group_dictionary = <T>(
        dictionary: _pi.Dictionary<T>,
        get_key: (item: T, id: string) => string,
    ): _pi.Dictionary<_pi.Dictionary<T>> => {
        const temp: { [id: string]: { [id: string]: T } } = {}
        dictionary.__to_list(($, id) => ({
            id: id,
            value: $,
        })).__for_each(($) => {
            const groupKey = get_key($.value, $.id)
            if (temp[groupKey] === undefined) {
                temp[groupKey] = {}
            }
            temp[groupKey][$.id] = $.value
        })
        return dictionary_literal(temp).__d_map(($) => dictionary_literal($))
    }

    export const group_list = <T>(
        list: _pi.List<T>,
        get_key: (item: T) => string,
    ): _pi.Dictionary<_pi.List<T>> => {
        const temp: { [id: string]: T[] } = {}
        list.__for_each(($) => {
            const id = get_key($)
            if (temp[id] === undefined) {
                temp[id] = []
            }
            temp[id].push($)
        })
        return dictionary_literal(temp).__d_map(($) => list_literal($))
    }

    export const literal = dictionary_literal

    export const map = <T, New_Type>(
        $: _pi.Dictionary<T>,
        handle_value: (
            value: T,
            id: string
        ) => New_Type,
    ): _pi.Dictionary<New_Type> => {
        return $.__d_map(handle_value)
    }

    export const resolve = <Unresolved, Resolved>(
        source: _pi.Dictionary<Unresolved>,
        handle_entry: (
            $: Unresolved,
            key: string,
            acyclic_lookup: _pi.Acyclic_Lookup<Resolved>,
            cyclic_lookup: _pi.Cyclic_Lookup<Resolved>,
        ) => Resolved,
    ): _pi.Dictionary<Resolved> => {
        const out: { [key: string]: Resolved } = {}

        const entries_started: { [key: string]: null } = {}

        type Cyclic_Reference = {
            'key': string,
            'value': undefined | Resolved,
            'abort': {
                no_such_entry: _pi.Abort<string>,
                accessing_cyclic_before_resolved: _pi.Abort<null>,
            }
        }

        const cyclic_references: Cyclic_Reference[] = []

        const inner_resolve = ($: Unresolved, key: string, stack: string[]): void => {
            if (out[key] !== undefined) {
                // already resolved
                return
            }
            entries_started[key] = null
            out[key] = handle_entry(
                $,
                key,
                {
                    get_entry: (
                        key,
                        abort,
                    ) => {
                        if (out[key] === undefined) {
                            if (entries_started[key] !== undefined) {
                                return abort['cyclic'](stack.concat([key]))
                            } else {
                                inner_resolve(
                                    source.__get_entry(
                                        key,
                                        () => abort.no_such_entry(key)
                                    ),
                                    key,
                                    stack.concat([key])
                                )
                            }

                        }
                        // now it must be resolved, otherwise we would have aborted
                        return out[key]
                    },
                    __get_entry_raw: (
                        key,
                        abort,
                    ) => {
                        const x = source.__get_entry_raw(key)
                        if (x === null) {
                            return null
                        } else {
                            if (out[key] === undefined) {
                                if (entries_started[key] !== undefined) {
                                    return abort.cyclic(stack.concat([key]))
                                } else {
                                    inner_resolve(
                                        x[0],
                                        key,
                                        stack.concat([key])
                                    )
                                }
                            }
                            // now it must be resolved, otherwise we would have aborted
                            return [out[key]]

                        }
                    }
                },
                {
                    get_entry: (
                        key,
                        abort,
                    ) => {
                        const temp_reference: Cyclic_Reference = {
                            'key': key,
                            'value': undefined,
                            'abort': abort,
                        }
                        cyclic_references.push(temp_reference)
                        return {
                            get_circular_dependent: () => {
                                if (temp_reference.value === undefined) {
                                    return abort.accessing_cyclic_before_resolved(null)
                                } else {
                                    return temp_reference.value
                                }
                            }
                        }
                    }
                }
            )
        }

        source.__d_map(($, key) => {
            inner_resolve($, key, [key])
        })

        cyclic_references.forEach(($) => {
            const value = out[$.key]
            if (value === undefined) {
                $.abort.no_such_entry($.key)
            } else {
                $.value = value
            }

        })

        return dictionary_literal(out)
    }

}

export namespace integer {

    /**
     * Performs integer division of two numbers (rounding towards negative infinity).
     * 
     * dividend / divisor
     * 
     * examples:
     * integer_division(7, 3) === 2
     * integer_division(7, -3) === -3
     * integer_division(-7, 3) === -3
     * integer_division(-7, -3) === 2
     */
    export const divide = (
        dividend: number,
        divisor: number,
        abort: _pi.Abort<['divide by zero', null]>,
    ): number => {
        if (divisor === 0) {
            abort(['divide by zero', null])
        }
        const quotient = dividend / divisor
        // when dividend and divisor have different signs, the quotient is negative
        // For positive quotients, use Math.floor to round down

        // this behavior matches the integer division in Python, Java, and C99 and later

        if (quotient >= 0) {
            return Math.floor(quotient)
        } else {
            return Math.ceil(quotient)
        }
    }
}

export namespace list {

    type List_Builder<T> = {
        'add element': ($: T) => void
        'add list': ($: _pi.List<T>) => void
    }
    export const deprecated_build = <T>($: ($c: List_Builder<T>) => void): _pi.List<T> => {
        const temp: T[] = []
        $({
            'add element': ($) => {
                temp.push($)
            },
            'add list': ($) => {
                temp.push(...$.__get_raw_copy())
            }
        })
        return list_literal(temp)
    }

    export const filter = <T, New_Type>(
        $: _pi.List<T>,
        handle_value: (
            value: T,
        ) => _pi.Optional_Value<New_Type>
    ): _pi.List<New_Type> => {
        const out: New_Type[] = []
        $.__for_each(($) => {
            const result = handle_value($)
            result.__extract_data(
                ($) => {
                    out.push($)
                },
                () => { }
            )
        })
        return list_literal(out)
    }

    export const flatten = <T, NT>(
        lists: (_pi.List<T>),
        callback: ($: T) => _pi.List<NT>,
    ): _pi.List<NT> => {
        const out: NT[] = []
        lists.__for_each(($) => {
            const innerList = callback($)
            innerList.__for_each(($) => {
                out.push($)
            })

        })
        return list_literal(out)
    }

    export const from_dictionary = <T, New_Type>(
        $: _pi.Dictionary<T>,
        handle_entry: ($: T, id: string) => New_Type
    ): _pi.List<New_Type> => {
        return $.__to_list(handle_entry)
    }

    export const from_single = <T>(
        $: T
    ): _pi.List<T> => {
        return list_literal([$])
    }

    export const literal = list_literal

    export type NonUndefined = null | {}

    export const nested_literal_old = <T extends NonUndefined | {}>(
        lists: (undefined | T[] | _pi.List<T>)[]
    ): _pi.List<T> => {
        const out: T[] = []
        lists.forEach(($) => {
            if ($ == undefined) {
                // do nothing
            } else if ($ instanceof Array) {
                $.forEach(($) => {
                    out.push($)
                })
            } else {
                $.__for_each(($) => {
                    out.push($)
                })
            }

        })
        return list_literal(out)
    }

    export type Nested<T> = undefined | Nested<T>[] | _pi.List<T>

    export const nested_literal_new = <T extends NonUndefined | {}>(
        nested: Nested<T>
    ): _pi.List<T> => {
        const out: T[] = []
        const flatten = (n: Nested<T>) => {
            if (n == undefined) {
                // do nothing
            } else if (n instanceof Array) {
                n.forEach(($) => {
                    flatten($)
                })
            } else {
                n.__for_each(($) => {
                    out.push($)
                })
            }
        }
        flatten(nested)
        return list_literal(out)
    }

    export const map = <T, New_Type>(
        $: _pi.List<T>,
        handle_value: (
            value: T,
        ) => New_Type,
    ): _pi.List<New_Type> => {
        return $.__l_map(handle_value)
    }

    export const map_with_state = <T, New_Type, State>(
        $: _pi.List<T>,
        initial_state: State,
        handle_value: (
            value: T,
            state: State
        ) => New_Type,
        update_state: (
            value: T,
            state: State
        ) => State
    ): _pi.List<New_Type> => {
        let current_state = initial_state
        return $.__l_map(($) => {
            const result = handle_value($, current_state)
            current_state = update_state($, current_state)
            return result
        })
    }

    export const reverse = <T>(
        $: _pi.List<T>
    ): _pi.List<T> => {
        return list_literal($.__get_raw_copy().slice().reverse())
    }

}

export namespace natural {

    export const amount_of_dictionary_entries = <T>(
        dictionary: _pi.Dictionary<T>,
    ): number => {
        return dictionary.__get_number_of_entries()
    }

    export const amount_of_list_elements = <T>(
        list: _pi.List<T>,
    ): number => {
        return list.__get_number_of_elements()
    }

    export const source_column = (depth: number): number => {
        return deprecated_get_location_info(depth).column
    }

    export const source_line = (depth: number): number => {
        return deprecated_get_location_info(depth).line
    }

    export const text_length = ($: string): number => $.length

}

export namespace optional {

    export function block<RT>(callback: () => _pi.Optional_Value<RT>): _pi.Optional_Value<RT> {
        return callback()
    }

    export const set = optional_set

    export const not_set = optional_not_set

    export const from_boolean = <T>(
        condition: boolean,
        value_if_set: T,
    ): _pi.Optional_Value<T> => {
        if (condition) {
            return optional_set(value_if_set)
        } else {
            return optional_not_set()
        }
    }

}

export namespace state {

    export function block<RT extends readonly [string, any]>(callback: () => RT): RT {
        return callback()
    }

}
