import * as _pi from "../../../../interface"
import { List_Class } from "../literals/List"


export namespace from {

    export const dictionary = <T>(
        dictionary: _pi.Dictionary<T>,
    ) => {
        return {

            convert: <New_Type>(
                assign_item: (
                    value: T,
                    id: string
                ) => New_Type
            ): _pi.List<New_Type> => {
                return dictionary.__to_list(assign_item)
            },

            flatten: <NT>(
                assign_item: (
                    value: T,
                    id: string
                ) => _pi.List<NT>,
            ): _pi.List<NT> => {
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

    export const list = <T>(
        list: _pi.List<T>,
    ) => {
        return {

            filter: <New_Type>(
                assign_optional_item: (
                    item: T,
                ) => _pi.Optional_Value<New_Type>
            ): _pi.List<New_Type> => {
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

            flatten: <NT>(
                assign_list: (
                    $: T
                ) => _pi.List<NT>,
            ): _pi.List<NT> => {
                const out: NT[] = []
                list.__get_raw_copy().forEach(($) => {
                    const innerList = assign_list($)
                    innerList.__get_raw_copy().forEach(($) => {
                        out.push($)
                    })

                })
                return new List_Class(out)
            },

            map: <New_Type>(
                assign_item: (
                    item: T,
                ) => New_Type,
            ): _pi.List<New_Type> => {
                return list.__l_map(assign_item)
            },

            reverse: (
            ): _pi.List<T> => {
                return new List_Class(list.__get_raw_copy().slice().reverse())
            }

        }
    }


}

export function literal<T>(
    source: readonly T[]
): _pi.List<T> {
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