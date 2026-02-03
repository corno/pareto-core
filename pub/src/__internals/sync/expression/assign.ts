import * as _pi from "../../../interface"

import { $$ as deprecated_get_location_info } from "../../get_location_info"
import { Dictionary_As_Array, Dictionary_Class, ID_Value_Pair } from "./literals/Dictionary"
import { List_Class } from "./literals/List"
import { Set_Optional_Value, Not_Set_Optional_Value } from "./literals/Optional"

export namespace boolean {

    export const dictionary_is_empty = <T>(
        $: _pi.Dictionary<T>,
    ): boolean => {
        return $.__get_number_of_entries() === 0
    }

    export const list_is_empty = <T>(
        $: _pi.List<T>,
    ): boolean => {
        return $.__get_number_of_items() === 0
    }

    export const optional_is_set = <T>(
        $: _pi.Optional_Value<T>,
    ): boolean => {
        return $.__decide(
            () => true,
            () => false
        )
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
        return dictionary.literal(out)
    }

    export const from_list = <T, NT>(
        list: _pi.List<T>,
        get_id: (item: T) => string,
        get_value: (item: T) => NT,
        abort: _pi.Abort<['duplicate id in list to dictionary', null]>,
    ): _pi.Dictionary<NT> => {
        const temp: { [id: string]: NT } = {}
        list.__get_raw_copy().forEach(($) => {
            const id = get_id($)
            if (temp[id] !== undefined) {
                abort(['duplicate id in list to dictionary', null])
            }
            temp[id] = get_value($)
        })
        return dictionary.literal(temp)
    }

    export const group_dictionary = <T>(
        $: _pi.Dictionary<T>,
        get_id: (item: T, id: string) => string,
    ): _pi.Dictionary<_pi.Dictionary<T>> => {
        const temp: { [id: string]: { [id: string]: T } } = {}
        $.__to_list(($, id) => ({
            id: id,
            value: $,
        })).__get_raw_copy().forEach(($) => {
            const group_id = get_id($.value, $.id)
            if (temp[group_id] === undefined) {
                temp[group_id] = {}
            }
            temp[group_id][$.id] = $.value
        })
        return dictionary.literal(temp).__d_map(($) => dictionary.literal($))
    }

    export const group_list = <T>(
        list: _pi.List<T>,
        get_id: (item: T) => string,
    ): _pi.Dictionary<_pi.List<T>> => {
        const temp: { [id: string]: T[] } = {}
        list.__get_raw_copy().forEach(($) => {
            const id = get_id($)
            if (temp[id] === undefined) {
                temp[id] = []
            }
            temp[id].push($)
        })
        return dictionary.literal(temp).__d_map(($) => new List_Class($))
    }

    export function literal<T>(source: { readonly [id: string]: T }): _pi.Dictionary<T> {


        function create_dictionary_as_array<X>(source: { readonly [id: string]: X }): Dictionary_As_Array<X> {
            const imp: ID_Value_Pair<X>[] = []
            Object.keys(source).forEach((id) => {
                imp.push({ id: id, value: source[id] })
            })
            return imp
        }
        return new Dictionary_Class(create_dictionary_as_array(source))
    }

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
            id: string,
            acyclic_lookup: _pi.Acyclic_Lookup<Resolved>,
            cyclic_lookup: _pi.Cyclic_Lookup<Resolved>,
        ) => Resolved,
    ): _pi.Dictionary<Resolved> => {
        const out: { [id: string]: Resolved } = {}

        const entries_started: { [id: string]: null } = {}

        type Cyclic_Reference = {
            'id': string,
            'value': undefined | Resolved,
            'abort': {
                no_such_entry: _pi.Abort<string>,
                accessing_cyclic_before_resolved: _pi.Abort<null>,
            }
        }

        const cyclic_references: Cyclic_Reference[] = []

        const inner_resolve = ($: Unresolved, id: string, stack: string[]): void => {
            if (out[id] !== undefined) {
                // already resolved
                return
            }
            entries_started[id] = null
            out[id] = handle_entry(
                $,
                id,
                {
                    get_entry: (
                        id,
                        abort,
                    ) => {
                        if (out[id] === undefined) {
                            if (entries_started[id] !== undefined) {
                                return abort['cycle_detected'](stack.concat([id]))
                            } else {
                                inner_resolve(
                                    source.__get_entry(
                                        id,
                                        () => abort.no_such_entry(id)
                                    ),
                                    id,
                                    stack.concat([id])
                                )
                            }

                        }
                        // now it must be resolved, otherwise we would have aborted
                        return out[id]
                    },
                    __get_entry_raw: (
                        id,
                        abort,
                    ) => {
                        const x = source.__get_entry_raw(id)
                        if (x === null) {
                            return null
                        } else {
                            if (out[id] === undefined) {
                                if (entries_started[id] !== undefined) {
                                    return abort.cycle_detected(stack.concat([id]))
                                } else {
                                    inner_resolve(
                                        x[0],
                                        id,
                                        stack.concat([id])
                                    )
                                }
                            }
                            // now it must be resolved, otherwise we would have aborted
                            return [out[id]]

                        }
                    }
                },
                {
                    get_entry: (
                        id,
                        abort,
                    ) => {
                        const temp_reference: Cyclic_Reference = {
                            'id': id,
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

        source.__d_map(($, id) => {
            inner_resolve($, id, [id])
        })

        cyclic_references.forEach(($) => {
            const value = out[$.id]
            if (value === undefined) {
                $.abort.no_such_entry($.id)
            } else {
                $.value = value
            }

        })

        return dictionary.literal(out)
    }

}

export namespace group {

    export const resolve = <Resolved>(
        callback: (
        ) => Resolved,
    ): Resolved => callback()

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

    export const filter = <T, New_Type>(
        $: _pi.List<T>,
        handle_value: (
            value: T,
        ) => _pi.Optional_Value<New_Type>
    ): _pi.List<New_Type> => {
        const out: New_Type[] = []
        $.__get_raw_copy().forEach(($) => {
            const result = handle_value($)
            result.__extract_data(
                ($) => {
                    out.push($)
                },
                () => { }
            )
        })
        return new List_Class(out)
    }

    export const flatten = <T, NT>(
        lists: (_pi.List<T>),
        callback: ($: T) => _pi.List<NT>,
    ): _pi.List<NT> => {
        const out: NT[] = []
        lists.__get_raw_copy().forEach(($) => {
            const innerList = callback($)
            innerList.__get_raw_copy().forEach(($) => {
                out.push($)
            })

        })
        return new List_Class(out)
    }

    export const from_dictionary = <T, New_Type>(
        $: _pi.Dictionary<T>,
        handle_entry: ($: T, id: string) => New_Type
    ): _pi.List<New_Type> => {
        return $.__to_list(handle_entry)
    }

    export function literal<T>(source: readonly T[]): _pi.List<T> {
        if (!(source instanceof Array)) {
            throw new Error("invalid input in 'list_literal'")
        }
        const data = source.slice() //create a copy
        /**
         * this is an implementation, not public by design
         * If you feel the need to rename this class, don't rename it to 'Array',
         * it will break the 'instanceOf Array' test
         */

        return new List_Class(data)
    }

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
                out.push(...$.__get_raw_copy())
            }

        })
        return new List_Class(out)
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
                out.push(...n.__get_raw_copy())
            }
        }
        flatten(nested)
        return new List_Class(out)
    }

    export const map = <T, New_Type>(
        $: _pi.List<T>,
        handle_item: (
            value: T,
        ) => New_Type,
    ): _pi.List<New_Type> => {
        return $.__l_map(handle_item)
    }

    export const map_with_state = <Source_Item, Target_Item, State, Result_Type>(
        $: _pi.List<Source_Item>,
        initial_state: State,
        handle_item: (
            value: Source_Item,
            state: State
        ) => Target_Item,
        update_state: (
            value: Target_Item,
            state: State
        ) => State,
        wrapup: (
            final_list: _pi.List<Target_Item>,
            final_state: State
        ) => Result_Type,
    ): Result_Type => {
        let current_state = initial_state
        return wrapup(
            $.__l_map(($) => {
                const result = handle_item($, current_state)
                current_state = update_state(result, current_state)
                return result
            }),
            current_state
        )
    }

    export const reduce = <Item, Result_Type>(
        $: _pi.List<Item>,
        initial_state: Result_Type,
        update_state: (
            value: Item,
            current: Result_Type
        ) => Result_Type,
    ): Result_Type => {
        let current_state = initial_state
        $.__get_raw_copy().forEach(($) => {
            current_state = update_state($, current_state)
        })
        return current_state
    }

    export const repeat = <T>(
        item: T,
        times: number,
    ): _pi.List<T> => {
        const out: T[] = []
        for (let i = 0; i < times; i++) {
            out.push(item)
        }
        return new List_Class(out)
    }

    export const reverse = <T>(
        $: _pi.List<T>
    ): _pi.List<T> => {
        return new List_Class($.__get_raw_copy().slice().reverse())
    }

}

export namespace natural {

    export const amount_of_dictionary_entries = <T>(
        dictionary: _pi.Dictionary<T>,
    ): number => {
        return dictionary.__get_number_of_entries()
    }

    export const amount_of_list_items = <T>(
        list: _pi.List<T>,
    ): number => {
        return list.__get_number_of_items()
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

    export const set = <T>(value: T): _pi.Optional_Value<T> => {
        return new Set_Optional_Value(value)
    }

    export const not_set = <T>(): _pi.Optional_Value<T> => {
        return new Not_Set_Optional_Value<T>()
    }

    export const from_boolean = <T>(
        condition: boolean,
        value_if_set: T,
    ): _pi.Optional_Value<T> => {
        if (condition) {
            return optional.set(value_if_set)
        } else {
            return optional.not_set()
        }
    }

    export const map = <T, New_Type>(
        $: _pi.Optional_Value<T>,
        handle_value: (value: T) => New_Type,
    ): _pi.Optional_Value<New_Type> => {
        return $.__decide(
            (value) => optional.set(handle_value(value)),
            () => optional.not_set()
        )
    }

}

export namespace state {

    export function block<RT extends readonly [string, any]>(callback: () => RT): RT {
        //this seems to be only used for switching on strings
        return callback()
    }

}
