import * as _pi from "./interface"


export namespace acyclic {

    export const not_set = <T>(): _pi.lookup.Acyclic<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        __get_entry_raw: (id, abort) => abort.no_context_lookup(null),
    })

    export const from_resolved_dictionary = <T>(
        dict: _pi.Dictionary<T>,
    ): _pi.lookup.Acyclic<T> => ({
        get_entry: (id, abort) => dict.__get_entry_deprecated(
            id,
            () => abort.no_such_entry(id),
        ),
        __get_entry_raw: (id, abort) => dict.__get_entry_raw(id)
    })

}

export namespace cyclic {

    export const not_set = <T>(): _pi.lookup.Cyclic<T> => ({
        get_entry: (id, abort) => {
            //return abort['no context lookup']()
            return {
                'get_circular_dependent': () => abort.no_context_lookup(null),
            }
        }
    })

}

export namespace stack {

    export const empty = <T>(): _pi.lookup.Stack<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        get_entry_depth(id) {
            return -1
        },
    })

    export const push = <T>(
        stack: _pi.lookup.Stack<T>,
        item: _pi.lookup.Acyclic<T>,
    ): _pi.lookup.Stack<T> => {
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