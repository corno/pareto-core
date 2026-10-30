import type * as p_di from "../../schema.js"
import type * as lookup from "../declaration/lookup.js"
import { type Abort } from "../../__internal/Abort.js"
import { Dictionary_Class } from "../../__internal/sync/primitives/Dictionary.js"
import * as lit from "./initialize.js"

export const map_dictionary = <
    T extends p_di.Value,
    New_Type extends p_di.Value,
>(
    dict: p_di.Dictionary<T>,
    assign_entry: (value: T, id: string) => New_Type,
): p_di.Dictionary<New_Type> =>
    new Dictionary_Class<New_Type>(
        dict.__get_raw().map(([id, value]) => {
            return [id, assign_entry(value, id)]
        }),
    )

export const convert_to_list = <
    T extends p_di.Value,
    New_Type extends p_di.Value,
>(
    dict: p_di.Dictionary<T>,
    assign_item: (value: T, id: string) => New_Type,
): p_di.List<New_Type> => {
    return lit.list(
        dict.__get_raw().map(([id, value]) => assign_item(value, id)),
    )
}

export const convert_to_list_via_segments = <
    T extends p_di.Value,
    New_Type extends p_di.Value,
>(
    dict: p_di.Dictionary<T>,
    assign_segment: (value: T, id: string) => p_di.List<New_Type>,
): p_di.List<New_Type> => {
    const out: New_Type[] = []
    dict.__get_raw().forEach(([id, value]) => {
        const innerList = assign_segment(value, id)
        innerList.__get_raw().forEach(($) => {
            out.push($)
        })
    })
    return lit.list(out)
}

export const get_possible_entry = <
    T extends p_di.Value,
    Result extends p_di.Value,
>(
    dict: p_di.Dictionary<T>,
    id: string,
    if_set: ($: T) => Result,
    if_not_set: () => Result,
): Result => {
    const raw = dict.__get_raw()
    for (let i = 0; i !== raw.length; i += 1) {
        const raw_entry = raw[i]!
        if (raw_entry[0] === id) {
            return if_set(raw_entry[1])
        }
    }
    return if_not_set()
}

export const zip_dictionaries = <
    T extends p_di.Value,
    Other_Type extends p_di.Value,
    Result extends p_di.Value,
>(
    dict: p_di.Dictionary<T>,
    other: p_di.Dictionary<Other_Type>,
    both: (value: T, other_value: Other_Type, id: string) => Result,
    missing: (value: T, id: string) => Result,
    superfluous: (value: Other_Type, id: string) => Result,
): p_di.Dictionary<Result> => {
    const other_entries = new Map(other.__get_raw())
    const driver_ids = new Set<string>()
    const out: [string, Result][] = []
    for (const [id, value] of dict.__get_raw()) {
        driver_ids.add(id)
        const other_value = other_entries.get(id)
        out.push([
            id,
            other_value === undefined
                ? missing(value, id)
                : both(value, other_value, id),
        ])
    }
    for (const [id, value] of other.__get_raw()) {
        if (!driver_ids.has(id)) {
            out.push([id, superfluous(value, id)])
        }
    }
    return new Dictionary_Class(out)
}

export const resolve_dictionary = <
    T extends p_di.Value,
    Resolved extends p_di.Value,
>(
    dict: p_di.Dictionary<T>,
    assign_entry: (
        value: T,
        id: string,
        acyclic_lookup: lookup.Acyclic<Resolved>,
        cyclic_lookup: lookup.Cyclic<Resolved>,
    ) => Resolved,
): p_di.Dictionary<Resolved> => {
    const source = dict
    const out: { [id: string]: Resolved } = Object.create(null)
    const entries_started: { [id: string]: null } = Object.create(null)
    type Cyclic_Reference = {
        id: string
        value: undefined | Resolved
        abort: {
            no_such_entry: Abort<string>
            accessing_cyclic_sibling_before_it_is_resolved: Abort<null>
        }
    }
    const cyclic_references: Cyclic_Reference[] = []
    const inner_resolve = (
        value: T,
        id: string,
        stack: string[],
    ): undefined => {
        if (out[id] !== undefined) {
            return
        }
        entries_started[id] = null
        out[id] = assign_entry(
            value,
            id,
            {
                get_entry: (id, abort) => {
                    if (out[id] === undefined) {
                        if (entries_started[id] !== undefined) {
                            return abort["cycle_detected"](
                                lit.list(stack.concat([id])),
                            )
                        } else {
                            inner_resolve(
                                get_possible_entry(
                                    source,
                                    id,
                                    ($) => $,
                                    () => abort.no_such_entry(null),
                                ),
                                id,
                                stack.concat([id]),
                            )
                        }
                    }
                    return out[id]!
                },
                __get_entry_raw: (id, abort) => {
                    const raw = dict.__get_raw()
                    for (let i = 0; i !== raw.length; i += 1) {
                        const raw_entry = raw[i]!
                        if (raw_entry[0] === id) {
                            if (out[id] === undefined) {
                                if (entries_started[id] !== undefined) {
                                    return abort.cycle_detected(
                                        lit.list(stack.concat([id])),
                                    )
                                } else {
                                    inner_resolve(
                                        raw_entry[1],
                                        id,
                                        stack.concat([id]),
                                    )
                                }
                            }
                            return [out[id]!]
                        }
                    }
                    return null
                },
            },
            {
                get_entry: (id, abort) => {
                    const temp_reference: Cyclic_Reference = {
                        id: id,
                        value: undefined,
                        abort: abort,
                    }
                    cyclic_references.push(temp_reference)
                    return {
                        get_circular_dependent: () => {
                            if (temp_reference.value === undefined) {
                                return abort.accessing_cyclic_sibling_before_it_is_resolved(
                                    null,
                                )
                            } else {
                                return temp_reference.value
                            }
                        },
                    }
                },
            },
        )
    }
    source.__get_raw().forEach(([id, value]) => {
        inner_resolve(value, id, [id])
    })
    cyclic_references.forEach(($) => {
        const value = out[$.id]
        if (value === undefined) {
            $.abort.no_such_entry($.id)
        } else {
            $.value = value
        }
    })
    return lit.dictionary(out)
}

export const map_list = <T extends p_di.Value, New_Type extends p_di.Value>(
    list: p_di.List<T>,
    assign_item: (item: T, index: number) => New_Type,
): p_di.List<New_Type> => {
    return lit.list(list.__get_raw().map(assign_item))
}

export const map_list_to_segments = <
    T extends p_di.Value,
    New_Type extends p_di.Value,
>(
    list: p_di.List<T>,
    assign_segment: (item: T, index: number) => p_di.List<New_Type>,
): p_di.List<New_Type> => {
    const out: New_Type[] = []
    list.__get_raw().forEach(($, index) => {
        const innerList = assign_segment($, index)
        innerList.__get_raw().forEach(($) => {
            out.push($)
        })
    })
    return lit.list(out)
}

export const navigate_list_to_segments = <
    T extends p_di.Value,
    Cursor extends p_di.Value,
    New_Type extends p_di.Value,
>(
    list: p_di.List<T>,
    initial: Cursor,
    segment: (item: T, cursor: Cursor, index: number) => p_di.List<New_Type>,
    next: (item: T, cursor: Cursor, index: number) => Cursor,
): p_di.List<New_Type> => {
    let cursor = initial
    const out: New_Type[] = []
    list.__get_raw().forEach((item, index) => {
        const result = segment(item, cursor, index)
        cursor = next(item, cursor, index)
        result.__get_raw().forEach(($) => {
            out.push($)
        })
    })
    return lit.list(out)
}

export const resolve_list = <
    T extends p_di.Value,
    Cursor extends p_di.Value,
    Result extends p_di.Value,
>(
    list: p_di.List<T>,
    initial: Cursor,
    assign_item: (item: T, cursor: Cursor, index: number) => Result,
    next: (result: Result, cursor: Cursor, index: number) => Cursor,
): p_di.List<Result> => {
    let cursor = initial
    return lit.list(
        list.__get_raw().map((item, index) => {
            const result = assign_item(item, cursor, index)
            cursor = next(result, cursor, index)
            return result
        }),
    )
}

export const on_has_first_item = <T extends p_di.Value, RT extends p_di.Value>(
    list: p_di.List<T>,
    if_true: ($: T, rest: p_di.List<T>) => RT,
    if_not_true: ($: p_di.List<T>) => RT,
): RT => {
    const list_raw = list.__get_raw()
    if (list_raw.length === 0) {
        return if_not_true(list)
    } else {
        return if_true(list_raw[0]!, lit.list(list_raw.slice(1)))
    }
}

export const on_has_last_item = <T extends p_di.Value, RT extends p_di.Value>(
    list: p_di.List<T>,
    if_true: ($: T, rest: p_di.List<T>) => RT,
    if_not_true: () => RT,
): RT => {
    const list_raw = list.__get_raw()
    if (list_raw.length === 0) {
        return if_not_true()
    } else {
        return if_true(
            list_raw[list_raw.length - 1]!,
            lit.list(list_raw.slice(0, -1)),
        )
    }
}

export const decide_optional = <T extends p_di.Value, RT extends p_di.Value>(
    optional_value: p_di.Optional_Value<T>,
    if_set: ($: T) => RT,
    if_not_set: () => RT,
): RT => {
    const raw = optional_value.__get_raw()
    return raw === null ? if_not_set() : if_set(raw[0])
}

export const map_optional = <T extends p_di.Value, New_Type extends p_di.Value>(
    optional_value: p_di.Optional_Value<T>,
    assign_set_value: (value: T) => New_Type,
): p_di.Optional_Value<New_Type> => {
    const raw = optional_value.__get_raw()
    return raw === null ? lit.not_set() : lit.set(assign_set_value(raw[0]))
}

export const decide_boolean = <RT>(
    boolean_value: boolean,
    if_true: () => RT,
    if_false: () => RT,
): RT => (boolean_value ? if_true() : if_false())

export const decide_state = <State extends p_di.State, RT extends p_di.Value>(
    state: State,
    assign: (output: State) => RT,
): RT => {
    return assign(state)
}

export const to_state = <State extends p_di.State>(
    string: string,
    assign_state: (text: string) => State,
) => assign_state(string)

export function change_context<T, R>($: T, callback: (context: T) => R): R {
    return callback($)
}

export function call<Source, Result, Arguments extends readonly unknown[]>(
    source: Source,
    transform: (source: Source, ...arguments_: Arguments) => Result,
    ...arguments_: Arguments
): Result {
    return transform(source, ...arguments_)
}

export function call_with_value<
    Source,
    Result,
    Arguments extends readonly unknown[],
>(
    source: Source,
    transform: (source: Source, ...arguments_: Arguments) => Result,
    ...arguments_: Arguments
): Result {
    return transform(source, ...arguments_)
}

export function expect_state_option<
    State extends p_di.State,
    Name extends State[0],
    Result extends p_di.Value,
>(
    state: State,
    expected: Name,
    if_expected: (
        value: Extract<State, readonly [Name, p_di.Value]>[1],
    ) => Result,
    if_unexpected: (name: State[0]) => Result,
): Result {
    function is_expected(
        value: State,
    ): value is Extract<State, readonly [Name, p_di.Value]> {
        return value[0] === expected
    }
    return is_expected(state) ? if_expected(state[1]) : if_unexpected(state[0])
}

export function reuse<T extends p_di.Value>(value: T): T {
    return value
}

export function map_boolean(value: boolean): boolean {
    return value
}

export function map_number(value: number): number {
    return value
}

export function map_text(value: string): string {
    return value
}

export function map_nothing<T extends null | symbol>(value: T): T {
    return value
}
