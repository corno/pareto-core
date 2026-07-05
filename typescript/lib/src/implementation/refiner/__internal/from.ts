import * as p_di from "../../../interface/data"
import * as p_ri from "../../../interface/refiner"
import { type Abort } from "../../../interface/__internal/Abort"
import * as lit from "../../__internal/sync/literal"
import { Dictionary_Class } from "../../__internal/sync/primitives/Dictionary"

export const dictionary = <T extends p_di.Value>(
    dict: p_di.Dictionary<T>,
) => {
    return {

        get_entry(
            id: string,
            abort: {
                no_such_entry: Abort<null>,
            }
        ): T {
            const raw = dict.__get_raw()
            for (let i = 0; i !== raw.length; i += 1) {
                const raw_entry = raw[i]!
                if (raw_entry[0] === id) {
                    return raw_entry[1]
                }
            }
            return abort.no_such_entry(null)
        },

        get_possible_entry(
            id: string,
        ): p_di.Optional_Value<T> {
            const raw = dict.__get_raw()
            for (let i = 0; i !== raw.length; i += 1) {
                const raw_entry = raw[i]!
                if (raw_entry[0] === id) {
                    return lit.set(raw_entry[1])
                }
            }
            return lit.not_set()
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

        resolve: <Resolved extends p_di.Value>(
            assign_entry: (
                value: T,
                id: string,
                acyclic_lookup: p_ri.lookup.Acyclic<Resolved>,
                cyclic_lookup: p_ri.lookup.Cyclic<Resolved>,
            ) => Resolved,
        ): p_di.Dictionary<Resolved> => {
            const source = dict
            const out: { [id: string]: Resolved } = {}

            const entries_started: { [id: string]: null } = {}

            type Cyclic_Reference = {
                'id': string,
                'value': undefined | Resolved,
                'abort': {
                    no_such_entry: Abort<string>,
                    accessing_cyclic_sibling_before_it_is_resolved: Abort<null>,
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
                            abort,
                        ) => {
                            if (out[id] === undefined) {
                                if (entries_started[id] !== undefined) {
                                    return abort['cycle_detected'](lit.list(stack.concat([id])))
                                } else {
                                    inner_resolve(
                                        dictionary(source).get_entry(
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
                            return out[id]!
                        },
                        __get_entry_raw: (
                            id,
                            abort,
                        ) => {

                            const raw = dict.__get_raw()

                            for (let i = 0; i !== raw.length; i += 1) {
                                const raw_entry = raw[i]!
                                if (raw_entry[0] === id) {
                                    if (out[id] === undefined) {
                                        if (entries_started[id] !== undefined) {
                                            return abort.cycle_detected(lit.list(stack.concat([id])))
                                        } else {
                                            inner_resolve(
                                                raw_entry[1],
                                                id,
                                                stack.concat([id])
                                            )
                                        }
                                    }
                                    // now it must be resolved, otherwise we would have aborted
                                    return [out[id]!]
                                }
                            }
                            return null
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
        },

    }
}

export const list = <T extends p_di.Value>(
    list: p_di.List<T>,
) => {
    return {

        convert_to_dictionary: <NT extends p_di.Value>(
            get_id: (
                item: T
            ) => string,
            get_value: (
                item: T
            ) => NT,
            abort: {
                duplicate_id: Abort<string>
            }
        ): p_di.Dictionary<NT> => {
            const temp: { [id: string]: NT } = {}
            list.__get_raw().forEach(($) => {
                const id = get_id($)
                if (temp[id] !== undefined) {
                    abort.duplicate_id(id)
                }
                temp[id] = get_value($)
            })
            return lit.dictionary(temp)
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
        }

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

        to_state: <
            State extends p_di.State,
            Context extends p_di.Value,
        >(
            context: Context,
            assign_state: ($: Context, text: string) => State
        ) => assign_state(context, string)

    }
}