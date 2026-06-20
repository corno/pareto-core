import * as p_i from "../../../interface/transformer"
import * as p_di from "../../../interface/data"

import * as lit from "../../__internal/sync/literal"

export namespace acyclic {

    export const not_set = <T extends p_di.Value>(
    ): p_i.lookup.Acyclic<T> => ({
        get_entry: (id, exception) => exception.no_context_lookup(null),
        // __get_entry_raw: (id, exception) => exception.no_context_lookup(null),
    })

    export const from_resolved_dictionary = <T extends p_di.Value>(
        dict: p_di.Dictionary<T>,
    ): p_i.lookup.Acyclic<T> => ({
        get_entry: (id, exception) => dict.__get_possible_entry_deprecated(
            id,
        ),
        // __get_entry_raw: (id, exception) => dict.__get_entry_raw(id)
    })

}

export namespace cyclic {

    export const not_set = <T extends p_di.Value>(
    ): p_i.lookup.Cyclic<T> => ({
        get_entry: (id, exception) => {
            //return exception['no context static_lookup']()
            return {
                'get_circular_dependent': () => exception.no_context_lookup(null),
            }
        }
    })

}

export namespace stack {

    export const empty = <T extends p_di.Value>(
    ): p_i.lookup.Stack<T> => ({
        get_entry: (id, exception) => exception.no_context_lookup(null),
        get_entry_depth(id) {
            return lit.set(-1)
        },
    })

    export const push = <T extends p_di.Value>(
        stack: p_i.lookup.Stack<T>,
        item: p_i.lookup.Acyclic<T>,
    ): p_i.lookup.Stack<T> => {
        return ({
            get_entry: (id, exception) => {
                return item.get_entry(
                    id,
                    exception,
                ).__decide(
                    ($) => lit.set($),
                    () => stack.get_entry(
                        id,
                        exception,
                    )
                )
            },
            get_entry_depth: (id, exception) => {

                return item.get_entry(
                    id,
                    exception,
                ).__decide(
                    ($) => lit.set(0),
                    () => stack.get_entry_depth(
                        id,
                        exception,
                    ).__decide(
                        ($) => lit.set(1 + $),
                        () => lit.not_set()
                    )
                )
            }
        })
    }

}