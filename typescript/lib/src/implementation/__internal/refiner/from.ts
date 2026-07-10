import * as p_di from "../../../interface/data.js"
import * as p_ri from "../../../interface/refiner.js"
import { type Abort } from "../../../interface/__internal/Abort.js"
import * as lit from "../sync/literal.js"
import { Dictionary_Class } from "../sync/primitives/Dictionary.js"

/**
 * Wraps a dictionary and provides entry lookup and transformation methods.
 */
export const dictionary = <T extends p_di.Value>(
    dict: p_di.Dictionary<T>,
) => {
    return {

        /**
         * Retrieves the entry with the given id.
         * Calls `abort.no_such_entry` if no entry with that id exists.
         * @param id the id of the entry to retrieve
         * @param abort callbacks invoked on error; `no_such_entry` is called when the id is not found
         * @returns the value of the entry
         */
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

        /**
         * Retrieves the entry with the given id if it exists, otherwise returns a not-set optional.
         * @param id the id of the entry to retrieve
         * @returns a set optional containing the entry value, or not-set if the id is not found
         */
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

        /**
         * Converts the values of the dictionary to a new type using the provided assign_entry function.
         * @param assign_entry function to convert each entry; receives the current value and the entry id
         * @returns a new dictionary with the same ids and the converted values
         */
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

        /**
         * gives the entries in the dictionary a new id.
         * if a duplicate id is found, the duplicate_id function is called to get the target dictionary
         * typically, you will use this function in a way where you can guarantee that there will be no duplicate ids, and the duplicate_id function will never be called,
         * so you typically will have a p_unreachable_code_path() call
         */
        re_id: (
            get_id: ($: T, id: string) => string,
            on_duplicate_id: ($: T, id: string) => never, //maybe it makes more sense to have this return a new id and test that one for uniqueness...
        ): p_di.Dictionary<T> => {
            const temp: { [id: string]: T } = {}
            dict.__get_raw().forEach(([id, value]) => {
                const new_id = get_id(value, id)
                if (temp[new_id] !== undefined) {
                    return on_duplicate_id(value, id)
                } else {
                    temp[new_id] = value
                }
            })
            return lit.dictionary(temp)
        },

        /**
         * Maps each entry to a resolved value, supporting cross-entry lookups during resolution.
         *
         * The `acyclic_lookup` allows looking up other entries that should not have any direct or indirect
         * dependency on the current entry; they are resolved on the spot if not yet resolved.
         * A `cycle_detected` abort is triggered if a cycle is found.
         *
         * The `cyclic_lookup` allows referencing entries that may depend on the current entry.
         * It returns a handle whose `get_circular_dependent` must not be called until all entries
         * in the dictionary have been fully resolved; accessing it too early triggers the
         * `accessing_cyclic_sibling_before_it_is_resolved` abort.
         *
         * @param assign_entry function called for each entry with its value, id, and both lookup handles
         * @returns a new dictionary containing the resolved values
         */
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

/**
 * Wraps a list and provides conversion and transformation methods.
 */
export const list = <T extends p_di.Value>(
    list: p_di.List<T>,
) => {
    return {

        /**
         * Converts the list to a dictionary using the provided id and value functions.
         * first asks for the id of an item, then for the value of that item.
         * Calls `abort.duplicate_id` if two items produce the same id.
         * @param get_id function to derive the dictionary key from each item
         * @param get_value function to derive the dictionary value from each item
         * @param abort callbacks invoked on error; `duplicate_id` is called with the conflicting id
         * @returns a new dictionary built from the list items
         */
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

        /**
         * Converts the items in the list to a new type using the provided assign_item function.
         * @param assign_item function to convert each item to a new value
         * @returns a new list containing the converted values
         */
        map: <New_Type extends p_di.Value>(
            assign_item: (
                item: T,
            ) => New_Type,
        ): p_di.List<New_Type> => {

            return lit.list(list.__get_raw().map((entry) => {
                return assign_item(entry)
            }))
        },

        /**
         * Maps the items in the list to a new type while maintaining a state that is updated with each item.
         * @param initial_state the initial value of the state before processing any items
         * @param assign_item function to convert each item using the current state
         * @param update_state function to produce the next state from the converted item and the current state
         * @param wrapup function called once with the final converted list and the final state to produce the result
         * @returns the result produced by `wrapup`
         */
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

/**
 * Wraps an optional value and provides methods to handle both the set and not-set cases.
 */
export const optional = <T extends p_di.Value>(
    optional_value: p_di.Optional_Value<T>,
) => {
    return {

        /**
         * Calls `if_set` with the wrapped value if it is set, otherwise calls `if_not_set`.
         * @param if_set function to call with the value when it is set
         * @param if_not_set function to call when the value is not set
         * @returns the result of whichever function was called
         */
        decide: <RT extends p_di.Value>(
            if_set: ($: T) => RT,
            if_not_set: () => RT
        ): RT => {
            const raw = optional_value.__get_raw()
            return raw === null
                ? if_not_set()
                : if_set(raw[0])
        },

        /**
         * Transforms the wrapped value using the provided function if it is set.
         * If the value is not set, returns a not-set optional.
         * @param assign_set_value function to transform the value
         * @returns a new optional containing the transformed value, or not-set if the original was not set
         */
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

/**
 * Wraps a state value and provides a method to produce a result from it.
 */
export const state = <State extends p_di.State>(
    state: State,
) => {
    return {

        /**
         * Passes the state to the provided function and returns the result.
         * @param assign function to produce a result from the state
         * @returns the result produced by `assign`
         */
        decide: <RT extends p_di.Value>(
            assign: (output: State) => RT
        ): RT => {
            return assign(state)
        }

    }
}

/**
 * Wraps a string value and provides a method to convert it into a state.
 */
export const text = (
    string: string,
) => {
    return {

        /**
         * Converts the string into a state value using the provided function and context.
         * @param context additional context passed to `assign_state`
         * @param assign_state function that receives the context and the string and returns the state
         * @returns the state produced by `assign_state`
         */
        to_state: <
            State extends p_di.State,
            Context extends p_di.Value,
        >(
            context: Context,
            assign_state: ($: Context, text: string) => State
        ) => assign_state(context, string)

    }
}