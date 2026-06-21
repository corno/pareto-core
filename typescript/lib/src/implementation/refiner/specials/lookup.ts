import * as p_di from "../../../interface/data"
import * as p_i from "../../../interface/refiner"

export namespace acyclic {

    export const not_set = <T extends p_di.Value>(
    ): p_i.lookup.Acyclic<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        __get_entry_raw: (id, abort) => abort.no_context_lookup(null),
    })

    export const from_resolved_dictionary = <T extends p_di.Value>(
        dict: p_di.Dictionary<T >,
    ): p_i.lookup.Acyclic<T> => ({
        get_entry: (id, abort) => dict.__get_entry_deprecated(
            id,
            {
                no_such_entry: () => abort.no_such_entry(null)
            },
        ),
        __get_entry_raw: (id, abort) => dict.__get_entry_raw_deprecated(id)
    })

}

export namespace cyclic {

    export const not_set = <T extends p_di.Value>(
    ): p_i.lookup.Cyclic<T> => ({
        get_entry: (id, abort) => {
            //return abort['no context static_lookup']()
            return {
                'get_circular_dependent': () => abort.no_context_lookup(null),
            }
        }
    })

}

export namespace stack {

    export const empty = <T extends p_di.Value>(
    ): p_i.lookup.Stack<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        get_entry_depth(id) {
            return -1
        },
    })

    export const push = <T extends p_di.Value>(
        stack: p_i.lookup.Stack<T>,
        item: p_i.lookup.Acyclic<T>,
    ): p_i.lookup.Stack<T> => {
        return ({
            get_entry: (id, abort) => {
                const temp = item.__get_entry_raw(
                    id,
                    abort,
                )
                if (temp === null) {
                    return stack.get_entry(
                        id,
                        abort,
                    )
                }
                return temp[0]
            },
            get_entry_depth: (id, abort) => {

                const temp = item.__get_entry_raw(
                    id,
                    abort,
                )
                if (temp === null) {
                    return 1 + stack.get_entry_depth(
                        id,
                        abort,
                    )
                }
                return 0
            }
        })
    }

}