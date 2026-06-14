import * as _pi from "./interface"


export namespace acyclic {

    export const not_set = <T extends _pi.Value>(
    ): _pi.static_lookup.Acyclic<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        __get_entry_raw: (id, abort) => abort.no_context_lookup(null),
    })

    export const from_resolved_dictionary = <T extends _pi.Value>(
        dict: _pi.Dictionary<T >,
    ): _pi.static_lookup.Acyclic<T> => ({
        get_entry: (id, abort) => dict.__get_entry_deprecated(
            id,
            {
                no_such_entry: () => abort.no_such_entry(null)
            },
        ),
        __get_entry_raw: (id, abort) => dict.__get_entry_raw(id)
    })

}

export namespace cyclic {

    export const not_set = <T extends _pi.Value>(
    ): _pi.static_lookup.Cyclic<T> => ({
        get_entry: (id, abort) => {
            //return abort['no context static_lookup']()
            return {
                'get_circular_dependent': () => abort.no_context_lookup(null),
            }
        }
    })

}

export namespace stack {

    export const empty = <T extends _pi.Value>(
    ): _pi.static_lookup.Stack<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        get_entry_depth(id) {
            return -1
        },
    })

    export const push = <T extends _pi.Value>(
        stack: _pi.static_lookup.Stack<T>,
        item: _pi.static_lookup.Acyclic<T>,
    ): _pi.static_lookup.Stack<T> => {
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