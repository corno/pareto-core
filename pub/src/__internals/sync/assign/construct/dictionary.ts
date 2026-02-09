import * as _pi from "../../../../interface"

import { Dictionary_As_Array, Dictionary_Class, ID_Value_Pair } from "../literals/Dictionary"
import { List_Class } from "../literals/List"

export namespace from {

    export const dictionary = <T>(
        dictionary: _pi.Dictionary<T>,
    ) => {
        return {

            filter: <New_Type>(
                handle_value: (
                    value: T,
                    id: string
                ) => _pi.Optional_Value<New_Type>
            ): _pi.Dictionary<New_Type> => {
                const out: { [id: string]: New_Type } = {}
                dictionary.__d_map(($, id) => {
                    const result = handle_value($, id)
                    result.__extract_data(
                        (new_value) => {
                            out[id] = new_value
                        },
                        () => { }
                    )
                })
                return literal(out)
            },

            group: (
                get_id: (
                    value: T,
                    id: string
                ) => string,
            ): _pi.Dictionary<_pi.Dictionary<T>> => {
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

            map: <New_Type>(
                assign_entry: (
                    value: T,
                    id: string
                ) => New_Type,
            ): _pi.Dictionary<New_Type> => {
                return dictionary.__d_map(assign_entry)
            },

            resolve: <Resolved>(
                assign_entry: (
                    value: T,
                    id: string,
                    acyclic_lookup: _pi.lookup.Acyclic<Resolved>,
                    cyclic_lookup: _pi.lookup.Cyclic<Resolved>,
                ) => Resolved,
            ): _pi.Dictionary<Resolved> => {
                const source = dictionary
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

                return literal(out)
            }


        }
    }

    export const list = <T>(
        list: _pi.List<T>,
    ) => {
        return {

            convert: <NT>(
                get_id: (
                    item: T
                ) => string,
                get_value: (
                    item: T
                ) => NT,
                abort: {
                    duplicate_id: _pi.Abort<null>
                }
            ): _pi.Dictionary<NT> => {
                const temp: { [id: string]: NT } = {}
                list.__get_raw_copy().forEach(($) => {
                    const id = get_id($)
                    if (temp[id] !== undefined) {
                        abort.duplicate_id(null)
                    }
                    temp[id] = get_value($)
                })
                return literal(temp)
            },

            group: (
                get_id: (
                    item: T
                ) => string,
            ): _pi.Dictionary<_pi.List<T>> => {
                const temp: { [id: string]: T[] } = {}
                list.__get_raw_copy().forEach(($) => {
                    const id = get_id($)
                    if (temp[id] === undefined) {
                        temp[id] = []
                    }
                    temp[id].push($)
                })
                return literal(temp).__d_map(($) => new List_Class($))
            }

        }
    }

}

export function literal<T>(
    source: { readonly [id: string]: T }
): _pi.Dictionary<T> {

    function create_dictionary_as_array<X>(
        source: { readonly [id: string]: X }
    ): Dictionary_As_Array<X> {
        const imp: ID_Value_Pair<X>[] = []
        Object.keys(source).forEach((id) => {
            imp.push({ id: id, value: source[id] })
        })
        return imp
    }
    
    return new Dictionary_Class(
        create_dictionary_as_array(source)
    )
}
