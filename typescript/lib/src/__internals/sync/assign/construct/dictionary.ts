import * as p_di from "../../../../data/interface"
import * as p_i from "../../../../interface"

import { Dictionary_As_Array, Dictionary_Class, ID_Value_Pair } from "../literals/Dictionary"
import { List_Class } from "../literals/List"

export namespace from {

    export const dictionary = <T extends p_di.Value>(
        dictionary: p_di.Dictionary<T>,
    ) => {
        return {

            filter: (
                callback: (
                    value: T,
                    id: string
                ) => boolean
            ): p_di.Dictionary<T> => new Dictionary_Class(dictionary.__get_raw_copy().filter(($) => callback($[1], $[0]))),

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

            flatten: <New_Type extends p_di.Value>(
                get_child_dictionary: (
                    value: T
                ) => p_di.Dictionary<New_Type>,
                get_id: (
                    parent_id: string,
                    child_id: string,
                ) => string,
                abort: {
                    duplicate_id: p_i.Abort<string>
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
                return literal(out)
            },

            group: (
                get_id: (
                    value: T,
                    id: string
                ) => string,
            ): p_di.Dictionary<p_di.Dictionary<T>> => {
                const temp: { [id: string]: { [id: string]: T } } = {}
                dictionary.__to_list(($, id) => ({
                    id: id,
                    value: $,
                })).__get_raw_copy().forEach(($) => {
                    const group_id = get_id($.value, $.id)
                    if (temp[group_id] === undefined) {
                        temp[group_id] = {}
                    }
                    temp[group_id][$.id] = $.value
                })
                return literal(temp).__d_map(($) => literal($))
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
                return literal(out)
            },

            map: <New_Type extends p_di.Value>(
                assign_entry: (
                    value: T,
                    id: string
                ) => New_Type,
            ): p_di.Dictionary<New_Type> => dictionary.__d_map(assign_entry),

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
                return literal(temp)
            },

            resolve_static: <Resolved extends p_di.Value>(
                assign_entry: (
                    value: T,
                    id: string,
                    acyclic_lookup: p_di.static_lookup.Acyclic<Resolved>,
                    cyclic_lookup: p_di.static_lookup.Cyclic<Resolved>,
                ) => Resolved,
            ): p_di.Dictionary<Resolved> => {
                const source = dictionary
                const out: { [id: string]: Resolved } = {}

                const entries_started: { [id: string]: null } = {}

                type Cyclic_Reference = {
                    'id': string,
                    'value': undefined | Resolved,
                    'abort': {
                        no_such_entry: p_i.Abort<string>,
                        accessing_cyclic_sibling_before_it_is_resolved: p_i.Abort<null>,
                    }
                }

                const cyclic_references: Cyclic_Reference[] = []

                const inner_resolve = (
                    value: T,
                    id: string,
                    stack: string[]
                ): void => {
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
                                abort,
                            ) => {
                                if (out[id] === undefined) {
                                    if (entries_started[id] !== undefined) {
                                        return abort['cycle_detected'](stack.concat([id]))
                                    } else {
                                        inner_resolve(
                                            source.__get_entry_deprecated(
                                                id,
                                                {
                                                    no_such_entry: () => abort.no_such_entry(null)
                                                }
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
                                            return abort.accessing_cyclic_sibling_before_it_is_resolved(null)
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
                        $.abort.no_such_entry($.id)
                    } else {
                        $.value = value
                    }

                })

                return literal(out)
            },

            resolve_dynamic: <Resolved extends p_di.Value>(
                assign_entry: (
                    value: T,
                    id: string,
                    acyclic_lookup: p_di.dynamic_lookup.Acyclic<Resolved>,
                    cyclic_lookup: p_di.dynamic_lookup.Cyclic<Resolved>,
                ) => Resolved,
            ): p_di.Dictionary<Resolved> => {
                const source = dictionary
                const out: { [id: string]: Resolved } = {}

                const entries_started: { [id: string]: null } = {}

                type Cyclic_Reference = {
                    'id': string,
                    'value': undefined | Resolved,
                    'abort': {
                        no_such_entry: p_i.Abort<string>,
                        accessing_cyclic_sibling_before_it_is_resolved: p_i.Abort<null>,
                    }
                }

                const cyclic_references: Cyclic_Reference[] = []

                const inner_resolve = (
                    value: T,
                    id: string,
                    stack: string[]
                ): void => {
                    if (out[id] !== undefined) {
                        // already resolved
                        return
                    }
                    entries_started[id] = null
                    out[id] = assign_entry(
                        value,
                        id,
                        {
                            map_possible_entry: (id, handlers) => {
                                throw new Error("IMPLEMENT map_possible_entry in resolve_dynamic")
                            }
                            // get_entry: (
                            //     id,
                            //     abort,
                            // ) => {
                            //     if (out[id] === undefined) {
                            //         if (entries_started[id] !== undefined) {
                            //             return abort['cycle_detected'](stack.concat([id]))
                            //         } else {
                            //             inner_resolve(
                            //                 source.__get_entry_deprecated(
                            //                     id,
                            //                     {
                            //                         no_such_entry: () => abort.no_such_entry(null)
                            //                     }
                            //                 ),
                            //                 id,
                            //                 stack.concat([id])
                            //             )
                            //         }

                            //     }
                            //     // now it must be resolved, otherwise we would have aborted
                            //     return out[id]
                            // },
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
                            //                 return abort.cycle_detected(stack.concat([id]))
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
                            'map_possible_entry': (id, handlers) => {
                                throw new Error("IMPLEMENT map_possible_entry in resolve_dynamic")

                            }
                            // get_entry: (
                            //     id,
                            //     abort,
                            // ) => {
                            //     const temp_reference: Cyclic_Reference = {
                            //         'id': id,
                            //         'value': undefined,
                            //         'abort': abort,
                            //     }
                            //     cyclic_references.push(temp_reference)
                            //     return {
                            //         get_circular_dependent: () => {
                            //             if (temp_reference.value === undefined) {
                            //                 return abort.accessing_cyclic_sibling_before_it_is_resolved(null)
                            //             } else {
                            //                 return temp_reference.value
                            //             }
                            //         }
                            //     }
                            // }
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
                        $.abort.no_such_entry($.id)
                    } else {
                        $.value = value
                    }

                })

                return literal(out)
            }


        }
    }

    export const list = <T extends p_di.Value>(
        list: p_di.List<T>,
    ) => {
        return {

            convert: <NT extends p_di.Value>(
                get_id: (
                    item: T
                ) => string,
                get_value: (
                    item: T
                ) => NT,
                abort: {
                    duplicate_id: p_i.Abort<string>
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
                return literal(temp)
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
                    temp2[id] = new List_Class(temp[id])
                })
                return literal(temp2)
            }

        }
    }

}

export function literal<T extends p_di.Value>(
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
