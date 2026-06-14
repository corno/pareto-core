import * as p_di from "../../../../data/interface"
import { List_Class } from "../literals/List"


export namespace from {

    export const dictionary = <T extends p_di.Value>(
        dictionary: p_di.Dictionary<T>,
    ) => {
        return {

            convert: <New_Type extends p_di.Value>(
                assign_item: (
                    value: T,
                    id: string
                ) => New_Type
            ): p_di.List<New_Type> => {
                return dictionary.__to_list(assign_item)
            },

            flatten: <NT extends p_di.Value>(
                assign_item: (
                    value: T,
                    id: string
                ) => p_di.List<NT>,
            ): p_di.List<NT> => {
                const out: NT[] = []
                dictionary.__to_list(assign_item).__get_raw_copy().forEach(($) => {
                    const innerList = $
                    innerList.__get_raw_copy().forEach(($) => {
                        out.push($)
                    })

                })
                return new List_Class(out)
            },

        }
    }

    export const list = <T extends p_di.Value>(
        list: p_di.List<T>,
    ) => {
        return {

            filter: (
                callback: (
                    item: T,
                ) => boolean
            ): p_di.List<T> => {
                return new List_Class(list.__get_raw_copy().filter(callback))
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
                return new List_Class(out)
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
                return new List_Class(out)
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
                return literal(out)
            },

            full_join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
                other_list: p_di.List<Other_Type>,
                assign_item: (
                    value: p_di.Optional_Value<T>,
                    other_value: p_di.Optional_Value<Other_Type>,
                ) => Result,
            ) => {
                const out: Result[] = []
                const maxLength = Math.max(list.__get_number_of_items(), other_list.__get_number_of_items())
                for (let i = 0; i < maxLength; i++) {
                    out.push(assign_item(
                        list.__deprecated_get_possible_item_at(i),
                        other_list.__deprecated_get_possible_item_at(i),
                    ))
                }
                return literal(out)
            },

            map: <New_Type extends p_di.Value>(
                assign_item: (
                    item: T,
                ) => New_Type,
            ): p_di.List<New_Type> => {
                return list.__l_map(assign_item)
            },

            reverse: (
            ): p_di.List<T> => {
                return new List_Class(list.__get_raw_copy().slice().reverse())
            },

            map_with_state: <
                Target_Element extends p_di.Value,
                State,
                Result_Type
            >(
                initial_state: State,
                handle_value: (
                    value: T,
                    state: State
                ) => Target_Element,
                update_state: (
                    value: Target_Element,
                    state: State
                ) => State,
                wrapup: (
                    final_list: p_di.List<Target_Element>,
                    final_state: State
                ) => Result_Type,
            ): Result_Type => {
                let current_state = initial_state
                return wrapup(
                    list.__l_map(($) => {
                        const result = handle_value($, current_state)
                        current_state = update_state(result, current_state)
                        return result
                    }),
                    current_state
                )
            }

        }
    }


}

export function literal<
    T extends p_di.Value
>(
    source: readonly T[]
): p_di.List<T> {
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

export const nested_literal_old = <T extends p_di.Value>(
    lists: (T[] | p_di.List<T>)[]
): p_di.List<T> => {
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

export const repeat = <T extends p_di.Value>(
    item: T,
    times: number,
): p_di.List<T> => {
    const out: T[] = []
    for (let i = 0; i < times; i++) {
        out.push(item)
    }
    return new List_Class(out)
}