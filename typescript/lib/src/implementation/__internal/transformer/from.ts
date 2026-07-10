import * as p_di from "../../../interface/data.js"
import * as p_ti from "../../../interface/transformer.js"
import { Dictionary_Class } from "../sync/primitives/Dictionary.js"
import { type Abort } from "../../../interface/__internal/Abort.js"
import * as lit from "../sync/literal.js"

/**
 * Wraps a boolean value, providing a `decide` method that branches into one of two callbacks based on the value.
 */
export const boolean = (
    boolean_value: boolean,
) => {
    return {

        /**
         * Calls `if_true` if the wrapped value is true, otherwise calls `if_false`.
         * @param if_true function to call when the value is true
         * @param if_false function to call when the value is false
         * @returns the result of whichever function was called
         */
        decide: <RT>(
            if_true: () => RT,
            if_false: () => RT
        ): RT => boolean_value
                ? if_true()
                : if_false()
    }
}

/**
 * Wraps a dictionary and provides a rich set of transformation and query methods.
 */
export const dictionary = <T extends p_di.Value>(
    dict: p_di.Dictionary<T>,
) => {
    return {

        /**
         * Returns the number of entries in the dictionary.
         */
        amount_of_entries: (
        ): number => {
            return dict.__get_raw().length
        },

        /**
         * each entry in the dictionary is converted to a list item using the provided assign_item function,
         * which gives access to the value and the id of the entry
         */
        convert_to_list: <New_Type extends p_di.Value>(
            assign_item: (
                value: T,
                id: string
            ) => New_Type
        ): p_di.List<New_Type> => {
            return lit.list(dict.__get_raw().map(([id, value]) => assign_item(value, id)))
        },

        /**
         * filters the dictionary entries based on the provided callback function.
         * if you also want to transform the values, use map_optionally instead.
         */
        filter: (
            callback: (
                value: T,
                id: string
            ) => boolean
        ): p_di.Dictionary<T> => new Dictionary_Class(dict.__get_raw().filter(([id, value]) => callback(value, id))),

        /**
         * Flattens a dictionary of dictionaries into a single dictionary,
         * the first step is to provide a child dictionary for each entry in the parent dictionary
         * the second step is to provide a new id based on the parent id and the child id
         * @param get_child_dictionary function to retrieve the child dictionary for each entry
         * @param get_id function to compute a new id from the parent id and the child id
         * @param abort callbacks invoked on error; `duplicate_id` is called with the conflicting id if two entries would share the same id
         * @returns a new flat dictionary containing all entries from all child dictionaries
         */
        flatten: <New_Type extends p_di.Value>(
            get_child_dictionary: (
                value: T
            ) => p_di.Dictionary<New_Type>,
            get_id: (
                parent_id: string,
                child_id: string,
            ) => string,
            abort: {
                duplicate_id: Abort<string>
            }
        ) => {
            const out: { [id: string]: New_Type } = {}

            dict.__get_raw().forEach(([id, value]) => {
                const child_dictionary = get_child_dictionary(value)
                child_dictionary.__get_raw().forEach(([child_id, child_value]) => {
                    const combined_id = get_id(id, child_id)
                    if (out[combined_id] !== undefined) {
                        abort.duplicate_id(combined_id)
                    }
                    out[combined_id] = child_value
                })
            })
            return lit.dictionary(out)
        },

        /**
         * flattens the dictionary into a list, where each entry in the dictionary is converted to a list of items using the provided assign_item function,
         */
        flatten_to_list: <NT extends p_di.Value>(
            assign_item: (
                value: T,
                id: string
            ) => p_di.List<NT>,
        ): p_di.List<NT> => {
            const out: NT[] = []
            dict.__get_raw().forEach(([id, value]) => {
                const innerList = assign_item(value, id)
                innerList.__get_raw().forEach(($) => {
                    out.push($)
                })

            })
            return lit.list(out)
        },

        /**
         * Retrieves a possible entry from the dictionary.
         * @param id The id of the entry to retrieve.
         * @param if_set Function to call if the entry is set.
         * @param if_not_set Function to call if the entry is not set.
         * @returns The result of either if_set or if_not_set.
         */
        get_possible_entry<RT extends p_di.Value>(
            id: string,
            if_set: ($: T) => RT,
            if_not_set: () => RT
        ): RT {
            const raw = dict.__get_raw()
            for (let i = 0; i !== raw.length; i += 1) {
                const raw_entry = raw[i]!
                if (raw_entry[0] === id) {
                    return if_set(raw_entry[1])
                }
            }
            return if_not_set()
        },

        /**
         * Groups the entries of the dictionary based on group id that is provided for each entry.
         * the entries of each group are then aggregated into a desired result using the provided aggregate function.
         * @param get_group_id Function to determine the group id for each entry.
         * @param aggregate Function to aggregate the entries of each group.
         * @returns A dictionary where the keys are group ids and the values are the aggregated results.
         */
        group: <RT extends p_di.Value>(
            get_group_id: (
                value: T,
                id: string
            ) => string,
            aggregate: ($: p_di.Dictionary<T>, group_id: string) => RT
        ): p_di.Dictionary<RT> => {
            const temp: { [id: string]: [string, T][] } = {}
            dict.__get_raw().forEach(([id, value]) => {
                const group_id = get_group_id(value, id)
                if (temp[group_id] === undefined) {
                    temp[group_id] = []
                }
                temp[group_id].push([id, value])
            })
            const temp2: { [id: string]: RT } = {}
            Object.keys(temp).forEach((group_id) => {
                temp2[group_id] = aggregate(new Dictionary_Class(temp[group_id]!), group_id)
            })
            return lit.dictionary(temp2)
        },

        /**
         * joins the current dictionary with another dictionary based on their ids.
         * The resulting dictionary will have the same ids and the same amount of entries as the current dictionary.
         * for each entry in the current dictionary, the corresponding entry in the other dictionary is retrieved (if it exists).
         * the provided assign_entry function is then called with the value from the current dictionary, the optional value from the other dictionary, and the id.
         * the result of assign_entry is used as the value for the new dictionary.
         * @param other_dictionary the dictionary to join against
         * @param assign_entry function called for each entry with the current value, the optional matching value from the other dictionary, and the entry id
         * @returns a new dictionary with the same ids as the current dictionary and values produced by `assign_entry`
         */
        join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
            other_dictionary: p_di.Dictionary<Other_Type>,
            assign_entry: (
                value: T,
                other_value: p_di.Optional_Value<Other_Type>,
                id: string
            ) => Result,
        ) => {
            const out: { [id: string]: Result } = {}
            dict.__get_raw().forEach(([id, value]) => {
                out[id] = assign_entry(
                    value,
                    dictionary(other_dictionary).get_possible_entry(
                        id,
                        (x) => lit.set(x),
                        () => lit.not_set()
                    ),
                    id
                )
            })
            return lit.dictionary(out)
        },

        /**
         * converts the values of the dictionary to a new type using the provided assign_entry function.
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
         * filters and converts values in 1 go, using the provided assign_optional_entry function.
         * if the function returns a not set value, it will be excluded from the new dictionary.
         * if the function returns a set value, it will be included in the new dictionary.
         * the set value will be the new value for that entry in the new dictionary.
         * @param assign_optional_entry 
         * @returns 
         */
        map_optionally: <New_Type extends p_di.Value>(
            assign_optional_entry: (
                value: T,
                id: string
            ) => p_di.Optional_Value<New_Type>
        ): p_di.Dictionary<New_Type> => new Dictionary_Class(
            dict
                .__get_raw()
                .map(([id, value]): [string, p_di.Optional_Value<New_Type>] => [id, assign_optional_entry(value, id)])
                .filter(([_, optional]) => optional.__get_raw() !== null)
                .map(([id, optional]) => [id, optional.__get_raw()![0]])
        ),

        /**
         * executes one of the provided functions depending on whether the dictionary has entries or not.
         * @param if_true function to execute if the dictionary has entries
         * @param if_not_true function to execute if the dictionary has no entries
         * @returns the result of the executed function
         */
        on_has_entries: <RT extends p_di.Value>(
            if_true: ($: p_di.Dictionary<T>) => RT,
            if_not_true: () => RT
        ): RT => dict.__get_raw().length !== 0
                ? if_true(dict)
                : if_not_true(),

        /**
         * executes one of the provided functions depending on whether the dictionary has a single entry, multiple entries, or no entries.
         * @param if_true function to execute if the dictionary has a single entry
         * @param if_multiple function to execute if the dictionary has multiple entries
         * @param if_none function to execute if the dictionary has no entries
         * @returns the result of the executed function
         */
        on_has_single_entry: <RT extends p_di.Value>(
            if_true: ($: T, id: string) => RT,
            if_multiple: ($: p_di.Dictionary<T>) => RT,
            if_none: () => RT,
        ): RT => list(lit.list(dict.__get_raw().map(([id, value]) => ({ 'id': id, 'value': value })))).on_has_single_item(
            (item) => if_true(item.value, item.id),
            () => if_multiple(dict),
            if_none,
        ),

        /**
         * gives the entries in the dictionary a new id.
         * if a duplicate id is found, the duplicate_id function is called to get the target dictionary
         * typically, you will use this function in a way where you can guarantee that there will be no duplicate ids, and the duplicate_id function will never be called,
         * so you typically will have a p_unreachable_code_path() call
         */
        re_id: (
            get_id: ($: T, key: string) => string,
            duplicate_id: (id: string) => p_di.Dictionary<T>, //maybe it makes more sense to have this return a new id and test that one for uniqueness...
        ): p_di.Dictionary<T> => {
            const temp: { [id: string]: T } = {}
            let duplicate_key: string | null = null
            dict.__get_raw().forEach(([id, value]) => {
                if (duplicate_key !== null) {
                    return
                }
                const new_id = get_id(value, id)
                if (temp[new_id] !== undefined) {
                    duplicate_key = new_id
                } else {
                    temp[new_id] = value
                }
            })
            if (duplicate_key !== null) {
                return duplicate_id(duplicate_key)
            } else {
                return lit.dictionary(temp)
            }
        },

        /**
         * use this function to map the values of the dictionary to a new type, while giving access to the siblings of this entry during the mapping process.
         * this is useful when the mapping of an entry depends on the values of other entries in the dictionary.
         * the assign_entry function is called for each entry in the dictionary, and is provided with the value of the entry, the id of the entry, and two lookups: acyclic and cyclic.
         * 
         * the acyclic lookup can be used to access other entries in the dictionary that have already been resolved (i.e. their assign_entry function has already been called),
         * or can be resolved on the spot without it having a direct or indirect dependency on the current entry.
         * 
         * the cyclic lookup can be used to access other entries in the dictionary that are potentially depending directly or indirectly on the current entry. The lookup will provide
         * a link to the other entry, but this link should not be accessed before the whole dictionary has been resolved, otherwise it will throw an exception. The cyclic lookup is useful for creating circular references between entries in the dictionary.
         * @param assign_entry 
         * @returns 
         */
        resolve: <Resolved extends p_di.Value>(
            assign_entry: (
                value: T,
                id: string,
                acyclic_lookup: p_ti.lookup.Acyclic<Resolved>,
                cyclic_lookup: p_ti.lookup.Cyclic<Resolved>,
            ) => Resolved,
        ): p_di.Dictionary<Resolved> => {
            const source = dict
            const out: { [id: string]: Resolved } = {}

            const entries_started: { [id: string]: null } = {}

            type Cyclic_Reference = {
                'id': string,
                'value': undefined | p_di.Optional_Value<Resolved>,
                'exception': {
                    accessing_cyclic_sibling_before_it_is_resolved: p_ti.lookup.Exception_Callback<Resolved, null>,
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
                            exception,
                        ) => {
                            let no_such_entry: boolean = false
                            if (out[id] === undefined) {
                                if (entries_started[id] !== undefined) {
                                    return exception['cycle_detected'](lit.list(stack.concat([id])))
                                } else {
                                    dictionary(source).get_possible_entry(
                                        id,
                                        ($) => {
                                            inner_resolve(
                                                $,
                                                id,
                                                stack.concat([id])
                                            )
                                            no_such_entry = false
                                            return null
                                        },
                                        () => {
                                            no_such_entry = true
                                            return null
                                        }
                                    )
                                }

                            }
                            // now it must be resolved, otherwise we would have aborted
                            if (no_such_entry) {
                                return lit.not_set()
                            } else {
                                return lit.set(out[id]!)
                            }
                        },
                    },
                    {
                        get_entry: (
                            id,
                            exception,
                        ) => {
                            const temp_reference: Cyclic_Reference = {
                                'id': id,
                                'value': undefined,
                                'exception': exception,
                            }
                            cyclic_references.push(temp_reference)
                            return {
                                get_circular_dependent: () => {
                                    if (temp_reference.value === undefined) {
                                        return exception.accessing_cyclic_sibling_before_it_is_resolved(null)
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
                    $.value = lit.not_set()
                } else {
                    $.value = lit.set(value)
                }

            })

            return lit.dictionary(out)
        },

        /**
         * sums all the entries of the dictionary.
         * each entry is converted to a number using the provided assign_value function, and the results are summed up.
         * @param assign_value function to convert each entry to a number
         * @returns the sum of all converted values
         */
        sum: (
            assign_value: (
                item: T,
            ) => number,
        ): number => {
            let sum = 0
            dict.__get_raw().forEach(([id, value]) => {
                sum += assign_value(value)
            })
            return sum
        },
    }
}

/**
 * Wraps a list and provides a rich set of transformation and query methods.
 */
export const list = <T extends p_di.Value>(
    list: p_di.List<T>,
) => {
    return {

        /**
         * Returns the number of items in the list.
         */
        amount_of_items: (
        ): number => {
            return list.__get_raw().length
        },

        /**
         * filters the list based on the provided callback function.
         * if you also want to transform the values, use map_optionally instead.
         * @param callback a function that takes an item and returns a boolean indicating whether the item should be included in the filtered list.
         * @returns a new list containing only the items for which the callback returned true.
         */
        filter: (
            callback: (
                item: T,
            ) => boolean
        ): p_di.List<T> => {
            return lit.list(list.__get_raw().filter(callback))
        },

        /**
         * flattens a list of lists into a single list, where each item in the original list is converted to a list of items using the provided assign_list function.
         * @param assign_list function to convert each item into a list of new items
         * @returns a new flat list containing all items produced by `assign_list`
         */
        flatten: <NT extends p_di.Value>(
            assign_list: (
                $: T
            ) => p_di.List<NT>,
        ): p_di.List<NT> => {
            const out: NT[] = []
            list.__get_raw().forEach(($) => {
                const innerList = assign_list($)
                innerList.__get_raw().forEach(($) => {
                    out.push($)
                })

            })
            return lit.list(out)
        },

        /**
         * performs a full join between the current list and another list, creating a new list of results based on the provided assign_item function.
         * The amount of items in the resulting list will be equal to the maximum amount of items in either of the two lists.
         * if you want the amount of items in the resulting list to be equal to the amount of items in the main list, use 'join' instead.
         * @param other_list 
         * @param assign_item 
         * @returns 
         */
        full_join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
            other_list: p_di.List<Other_Type>,
            assign_item: (
                value: p_di.Optional_Value<T>,
                other_value: p_di.Optional_Value<Other_Type>,
            ) => Result,
        ) => {
            const this_list_raw = list.__get_raw()
            const other_list_raw = other_list.__get_raw()
            const out: Result[] = []
            const maxLength = Math.max(
                this_list_raw.length,
                other_list_raw.length
            )
            for (let i = 0; i < maxLength; i++) {
                out.push(
                    assign_item(
                        i < this_list_raw.length
                            ? lit.set(this_list_raw[i]!)
                            : lit.not_set(),
                        i < other_list_raw.length
                            ? lit.set(other_list_raw[i]!)
                            : lit.not_set()
                    )
                )
            }
            return lit.list(out)
        },

        /**
         * groups the items in the list based on a group id that is provided for each item.
         * the items of each group are then aggregated into a desired result using the provided aggregate function.
         * @param get_id function to determine the group id for each item
         * @param aggregate function to aggregate the items of each group into a result value
         * @returns a dictionary where the keys are group ids and the values are the aggregated results
         */
        group: <RT extends p_di.Value>(
            get_id: (
                item: T
            ) => string,
            aggregate: ($: p_di.List<T>, group_id: string) => RT
        ): p_di.Dictionary<RT> => {
            const temp: { [id: string]: T[] } = {}
            list.__get_raw().forEach(($) => {
                const id = get_id($)
                if (temp[id] === undefined) {
                    temp[id] = []
                }
                temp[id].push($)
            })
            const temp2: { [id: string]: RT } = {}
            Object.keys(temp).forEach((id) => {
                temp2[id] = aggregate(lit.list(temp[id]!), id)
            })
            return lit.dictionary(temp2)
        },

        /**
         * joins the current list with another list based on their indices.
         * The resulting list will have the same amount of items as the current list.
         * for each item in the current list, the corresponding item in the other list is retrieved (if it exists).
         * the provided assign_item function is then called with the value from the current list, the optional value from the other list.
         * the result of assign_item is used as the value for the new list.
         * @param other_list 
         * @param assign_item 
         * @returns 
         */
        join: <Other_Type extends p_di.Value, Result extends p_di.Value>(
            other_list: p_di.List<Other_Type>,
            assign_item: (
                value: T,
                other_value: p_di.Optional_Value<Other_Type>,
            ) => Result,
        ): p_di.List<Result> => {
            const out: Result[] = []
            const other_list_raw = other_list.__get_raw()
            let index = -1
            list.__get_raw().forEach(
                ($) => {
                    index++
                    out.push(assign_item(
                        $,
                        index < other_list_raw.length
                            ? lit.set(other_list_raw[index]!)
                            : lit.not_set(),
                    ))
                }
            )
            return lit.list(out)
        },

        /**
         * converts the items in the list to a new type using the provided assign_item function.
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
         * filters and converts items in 1 go, using the provided assign_optional_item function.
         * if the function returns a not set value, it will be excluded from the new list.
         * if the function returns a set value, it will be included in the new list.
         * the set value will be the new value for that item in the new list.
         * @param assign_optional_item 
         * @returns 
         */
        map_optionally: <New_Type extends p_di.Value>(
            assign_optional_item: (
                item: T,
            ) => p_di.Optional_Value<New_Type>
        ): p_di.List<New_Type> => {
            const out: New_Type[] = []
            list.__get_raw().forEach(($) => {
                const raw = assign_optional_item($).__get_raw()
                if (raw !== null) {
                    out.push(raw[0])
                }
            })
            return lit.list(out)
        },

        /**
         * converts the items in the list to a new type using the provided assign_item function.
         * the assign_item function receives both the item and its index in the list.
         * @param assign_item 
         * @returns 
         */
        map_with_index: <New_Type extends p_di.Value>(
            assign_item: (
                item: T,
                index: number
            ) => New_Type,
        ): p_di.List<New_Type> => {

            return lit.list(list.__get_raw().map(($, index) => assign_item($, index)))
        },

        /**
         * maps the items in the list to a new type while maintaining a state that can be updated with each item.
         * the initial state is provided as an argument, and the assign_item function is called for each item in the list, receiving both the item and the current state.
         * the update_state function is then called with the result of assign_item and the current state, allowing you to update the state for the next iteration.
         * finally, after all items have been processed, the wrapup function is called with the final list of results and the final state, allowing you to produce a final result.
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

        /**
         * executes one of the provided functions depending on whether the list has a first item or not.
         * if it has a first item, the if_true function is called with the first item and the rest of the list (excluding the first item).
         * if it does not have a first item, the if_not_true function is called.
         * @param if_true function to execute if the list has a first item
         * @param if_not_true function to execute if the list does not have a first item
         * @returns the result of either if_true or if_not_true
         */
        on_has_first_item: <RT extends p_di.Value>(
            if_true: ($: T, rest: p_di.List<T>) => RT,
            if_not_true: ($: p_di.List<T>) => RT
        ): RT => {
            const list_raw = list.__get_raw()
            if (list_raw.length === 0) {
                return if_not_true(list)
            } else {
                return if_true(
                    list_raw[0]!,
                    lit.list(list_raw.slice(1))
                )
            }
        },

        /**
         * executes one of the provided functions depending on whether the list has items or not.
         * @param if_true function to execute if the list has items
         * @param if_not_true function to execute if the list does not have items
         * @returns the result of either if_true or if_not_true
         */
        on_has_items: <RT extends p_di.Value>(
            if_true: ($: p_di.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__get_raw().length !== 0
                ? if_true(list)
                : if_not_true(),

        /**
         * executes one of the provided functions depending on whether the list has a last item or not.
         * if it has a last item, the if_true function is called with the last item and the rest of the list (excluding the last item).
         * if it does not have a last item, the if_not_true function is called.
         * @param if_true function to execute if the list has a last item
         * @param if_not_true function to execute if the list does not have a last item
         * @returns the result of either if_true or if_not_true
         */
        on_has_last_item: <RT extends p_di.Value>(
            if_true: (
                $: T,
                rest: p_di.List<T>
            ) => RT,
            if_not_true: () => RT
        ): RT => {
            const list_raw = list.__get_raw()
            if (list_raw.length === 0) {
                return if_not_true()
            } else {
                return if_true(
                    list_raw[list_raw.length - 1]!,
                    lit.list(list_raw.slice(0, -1))
                )
            }
        },

        /**
         * sequentially tests each item in the list with the provided test function.
         * If a match is found, it returns the result of the test function.
         * If no match is found, it returns the result of the if_no_match function.
         */
        on_has_match: <RT extends p_di.Value>(
            test: ($: T) => p_di.Optional_Value<RT>,
            if_no_match: () => RT,
        ): RT => {
            const raw = list.__get_raw()
            for (let i = 0; i < raw.length; i++) {
                const item = raw[i]!
                const result = test(item).__get_raw()
                if (result !== null) {
                    return result[0]
                }
            }
            return if_no_match()
        },

        /**
         * executes one of the provided functions depending on whether the list has a single item, multiple items, or no items.
         * if it has a single item, the if_true function is called with that item.
         * if it has multiple items, the if_multiple function is called with the entire list.
         * if it has no items, the if_none function is called.
         * @param if_true function to execute if the list has a single item
         * @param if_multiple function to execute if the list has multiple items
         * @param if_none function to execute if the list has no items
         * @returns the result of either if_true, if_multiple, or if_none
         */
        on_has_single_item: <RT extends p_di.Value>(
            if_true: ($: T) => RT,
            if_multiple: ($: p_di.List<T>) => RT,
            if_none: () => RT,
        ): RT => {
            const list_raw = list.__get_raw()
            if (list_raw.length === 0) {
                return if_none()
            } else if (list_raw.length === 1) {
                return if_true(list_raw[0]!)
            } else {
                return if_multiple(list)
            }
        },

        /**
         * sums all the items in the list.
         * each item is converted to a number using the provided assign_value function, and the results are summed up.
         * @param assign_value function to convert each item to a number
         * @returns the sum of all items
         */
        sum: (
            assign_value: (
                item: T,
            ) => number,
        ): number => {
            let sum = 0
            list.__get_raw().forEach(($) => {
                sum += assign_value($)
            })
            return sum
        },

        /**
         * reduces the list to a boolean value by iteratively applying the update_state function to each item and the current state, starting from the initial_state.
         * @param initial_state the initial boolean state
         * @param update_state function to update the state based on each item
         * @returns the final boolean state after processing all items
         */
        reduce_to_boolean: (
            initial_state: boolean,
            update_state: (
                value: T,
                current: boolean
            ) => boolean,
        ): boolean => {
            let current_state = initial_state
            list.__get_raw().forEach(($) => {
                current_state = update_state($, current_state)
            })
            return current_state
        },

        /**
         * reduces the list to a number by iteratively applying the update_state function to each item and the current state, starting from the initial_state.
         * @param initial_state the initial numeric state
         * @param update_state function to update the state based on each item
         * @returns the final numeric state after processing all items
         */
        reduce_to_number: (
            initial_state: number,
            update_state: (
                value: T,
                current: number
            ) => number,
        ): number => {
            let current_state = initial_state
            list.__get_raw().forEach(($) => {
                current_state = update_state($, current_state)
            })
            return current_state
        },

        /**
         * reverses the order of the items in the list.
         * @returns a new list with the items in reverse order
         */
        reverse: (
        ): p_di.List<T> => {
            return lit.list(list.__get_raw().slice().reverse())
        },


    }
}

/**
 * Wraps a numeric value and provides arithmetic and utility methods.
 */
export const number = (
    number: number,
) => {
    return {

        /**
         * Performs integer division of two numbers with configurable rounding behavior.
         * 
         * dividend / divisor
         * 
         * Rounding modes:
         * - 'towards negative infinity': floor (7.8 → 7, -7.8 → -8)
         * - 'towards positive infinity': ceiling (7.2 → 8, -7.8 → -7)
         * - 'towards zero': truncate (7.8 → 7, -7.8 → -7)
         * - 'towards nearest': round to nearest integer (7.5 → 8, 7.4 → 7)
         * - 'away from zero': round away from zero (7.2 → 8, -7.2 → -8)
         */
        divide: (
            divisor: number,
            round:
                | ['towards negative infinity', null]
                | ['towards positive infinity', null]
                | ['towards nearest', null]
                | ['towards zero', null]
                | ['away from zero', null],
            abort: {
                divided_by_zero: Abort<null>
            },
        ): number => {
            if (divisor === 0) {
                abort.divided_by_zero(null)
            }
            const quotient = number / divisor

            switch (round[0]) {
                case 'towards negative infinity':
                    // Always round down (floor)
                    return Math.floor(quotient)

                case 'towards positive infinity':
                    // Always round up (ceiling)
                    return Math.ceil(quotient)

                case 'towards zero':
                    // Truncate decimal part (round towards zero)
                    return Math.trunc(quotient)

                case 'towards nearest':
                    // Round to nearest integer (0.5 rounds away from zero)
                    return Math.round(quotient)

                case 'away from zero':
                    // Round away from zero
                    if (quotient >= 0) {
                        return Math.ceil(quotient)
                    } else {
                        return Math.floor(quotient)
                    }

                default:
                    const _exhaustiveCheck: never = round
                    throw new Error(`Unexpected rounding mode: ${round}`)
            }
        },

        /**
         * Creates a list containing the given item repeated `number` times.
         * @param item the value to repeat
         * @returns a list of length `number` where every element is `item`
         */
        repeat: <T extends p_di.Value>(
            item: T,
        ): p_di.List<T> => {
            const out: T[] = []
            for (let i = 0; i < number; i++) {
                out.push(item)
            }
            return lit.list(out)
        }


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
        },

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
 * Wraps a string value. Currently no transformation methods are defined.
 */
export const text = (
    string: string,
) => {
    return {


    }
}