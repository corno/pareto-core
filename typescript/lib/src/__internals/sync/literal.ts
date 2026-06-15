import * as p_di from "../../data/interface"

import { Dictionary_As_Array, Dictionary_Class, ID_Value_Pair } from "../sync/assign/literals/Dictionary"
import { List_Class } from "../sync/assign/literals/List"
import { Set_Optional_Value, Not_Set_Optional_Value } from "../sync/assign/literals/Optional"

export function dictionary<T extends p_di.Value>(
    source: { readonly [id: string]: T }
): p_di.Dictionary<T> {

    function create_dictionary_as_array<X extends p_di.Value>(
        source: { readonly [id: string]: X }
    ): Dictionary_As_Array<X> {
        const imp: ID_Value_Pair<X>[] = []
        Object.keys(source).forEach((id) => {
            imp.push([id, source[id]])
        })
        return imp
    }

    return new Dictionary_Class(
        create_dictionary_as_array(source)
    )
}


export function list<
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

export const nested_list = <T extends p_di.Value>(
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

export const set = <T extends p_di.Value>(
    value: T
): p_di.Optional_Value<T> => {
    return new Set_Optional_Value(value)
}

export const not_set = <T extends p_di.Value>(
): p_di.Optional_Value<T> => {
    return new Not_Set_Optional_Value<T>()
}

export const group_resolve = <Resolved extends p_di.Group>(
    assign: (
    ) => Resolved,
): Resolved => assign()