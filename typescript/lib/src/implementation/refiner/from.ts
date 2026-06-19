import * as p_di from "../../interface/data"
import * as p_ri from "../../interface/refiner"
import { Abort } from "../../interface/__internal/Abort"
import * as lit from "../__internal/sync/literal"


export const boolean = (
    boolean_value: boolean,
) => {
    return {



    }
}

export const dictionary = <T extends p_di.Value>(
    dictionary: p_di.Dictionary<T>,
) => {
    return {

        map: <New_Type extends p_di.Value>(
            assign_entry: (
                value: T,
                id: string
            ) => New_Type,
        ): p_di.Dictionary<New_Type> => dictionary.__d_map_deprecated(assign_entry),

        resolve: <Resolved extends p_di.Value>(
            assign_entry: (
                value: T,
                id: string,
                acyclic_lookup: p_ri.lookup.Acyclic<Resolved>,
                cyclic_lookup: p_ri.lookup.Cyclic<Resolved>,
            ) => Resolved,
        ): p_di.Dictionary<Resolved> => {
            const source = dictionary
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
                                        return abort.cycle_detected(lit.list(stack.concat([id])))
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
            list.__get_raw_copy().forEach(($) => {
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
            return list.__l_map_deprecated(assign_item)
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
                list.__l_map_deprecated(($) => {
                    const result = assign_item($, current_state)
                    current_state = update_state(result, current_state)
                    return result
                }),
                current_state
            )
        },


    }
}

export namespace number {

}

export const number = (
    number: number,
) => {
    return {
    }
}

export const optional = <T extends p_di.Value>(
    optional_value: p_di.Optional_Value<T>,
) => {
    return {

        map: <New_Type extends p_di.Value>(
            assign_set_value: (
                value: T
            ) => New_Type,
        ): p_di.Optional_Value<New_Type> => {
            return optional_value.__decide(
                (value): p_di.Optional_Value<New_Type> => lit.set<New_Type>(assign_set_value(value)),
                () => lit.not_set<New_Type>()
            )
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

        state: <
            State extends p_di.State,
            Context extends p_di.Value,
        >(
            context: Context,
            assign_state: ($: Context, text: string) => State
        ) => assign_state(context, string)

    }
}