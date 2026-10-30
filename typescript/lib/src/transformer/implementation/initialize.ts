import type * as p_di from "../../schema.js"
import {
    Dictionary_Class,
    type Dictionary_As_Array,
    type ID_Value_Pair,
} from "../../__internal/sync/primitives/Dictionary.js"
import { List_Class } from "../../__internal/sync/primitives/List.js"
import {
    Set_Optional_Value,
    Not_Set_Optional_Value,
} from "../../__internal/sync/primitives/Optional.js"
import unreachable_code_path from "./unreachable_code_path.js"

export function dictionary<T extends p_di.Value>(source: {
    readonly [id: string]: T
}): p_di.Dictionary<T> {
    function create_dictionary_as_array<X extends p_di.Value>(source: {
        readonly [id: string]: X
    }): Dictionary_As_Array<X> {
        const imp: ID_Value_Pair<X>[] = []
        Object.keys(source).forEach((id) => {
            imp.push([id, source[id]!])
        })
        return imp
    }
    return new Dictionary_Class(create_dictionary_as_array(source))
}

export function list<T extends p_di.Value>(source: readonly T[]): p_di.List<T> {
    if (!(source instanceof Array)) {
        unreachable_code_path("invalid input in 'list_literal'")
    }
    const data = source.slice()
    return new List_Class(data)
}

export function segmented_list<T extends p_di.Value>(
    lists: p_di.List<T>[],
): p_di.List<T> {
    const out: T[] = []
    lists.forEach(($) => {
        $.__get_raw().forEach(($) => {
            out.push($)
        })
    })
    return new List_Class(out)
}

export function chained_list<T extends p_di.Value>(
    list: p_di.List<T>,
    tail_element: T,
): p_di.List<T> {
    const out: T[] = []
    list.__get_raw().forEach(($) => {
        out.push($)
    })
    out.push(tail_element)
    return new List_Class(out)
}

export function set<T extends p_di.Value>(value: T): p_di.Optional_Value<T> {
    return new Set_Optional_Value(value)
}

export function not_set<T extends p_di.Value>(): p_di.Optional_Value<T> {
    return new Not_Set_Optional_Value<T>()
}

export function group<Resolved extends p_di.Group>(
    assign: () => Resolved,
): Resolved {
    return assign()
}

export function nothing(): symbol {
    return Symbol()
}

export function segmented_text(segments: string[]): string {
    return segments.join("")
}

export function component<T extends p_di.Value>(value: T): T {
    return value
}

export function cyclic_component<T extends p_di.Value>(value: T): T {
    return value
}

export function reference_from_value<T extends p_di.Value>(value: T): T {
    return value
}

export function reference_from_lookup<
    T extends p_di.Value,
    Arguments extends readonly unknown[],
>(
    lookup: { get_entry: (...arguments_: Arguments) => T },
    ...arguments_: Arguments
): T {
    return lookup.get_entry(...arguments_)
}

export function state<Name extends string, T extends p_di.Value>(
    option: Name,
    value: T,
): readonly [Name, T] {
    return [option, value]
}

export function text(value: string): string {
    return value
}

function initialize_true(): boolean {
    return true
}

function initialize_false(): boolean {
    return false
}

export { initialize_true as true, initialize_false as false }

export function group_with_dependencies<Dependencies, Result>(
    dependencies: Dependencies,
    resolve: ($parent_captures: Dependencies) => Result,
): Result {
    return resolve(dependencies)
}

export function scope<Result>(assign: () => Result): Result {
    return assign()
}
