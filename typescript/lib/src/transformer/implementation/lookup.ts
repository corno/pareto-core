import type * as p_di from "../../schema.js"
import type { Acyclic, Cyclic, Stack } from "../declaration/lookup.js"
import * as convert from "./with.js"

export namespace acyclic {
    export const not_set = <T extends p_di.Value>(): Acyclic<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        __get_entry_raw: (id, abort) => abort.no_context_lookup(null),
    })

    export const from_resolved_dictionary = <T extends p_di.Value>(
        dict: p_di.Dictionary<T>,
    ): Acyclic<T> => ({
        get_entry: (id, abort) =>
            convert.get_possible_entry(
                dict,
                id,
                ($) => $,
                () => abort.no_such_entry(null),
            ),
        __get_entry_raw: (id, abort) => {
            const raw = dict.__get_raw()
            for (let i = 0; i !== raw.length; i += 1) {
                const entry = raw[i]!
                if (entry[0] === id) {
                    return [entry[1]]
                }
            }
            return null
        },
    })
}

export namespace cyclic {
    export const not_set = <T extends p_di.Value>(): Cyclic<T> => ({
        get_entry: (id, abort) => ({
            get_circular_dependent: () => abort.no_context_lookup(null),
        }),
    })
}

export namespace stack {
    export const empty = <T extends p_di.Value>(): Stack<T> => ({
        get_entry: (id, abort) => abort.no_context_lookup(null),
        get_entry_depth(id) {
            return -1
        },
    })

    export const push = <T extends p_di.Value>(
        stack: Stack<T>,
        item: Acyclic<T>,
    ): Stack<T> => ({
        get_entry: (id, abort) => {
            const temp = item.__get_entry_raw(id, abort)
            if (temp === null) {
                return stack.get_entry(id, abort)
            }
            return temp[0]
        },
        get_entry_depth: (id, abort) => {
            const temp = item.__get_entry_raw(id, abort)
            if (temp === null) {
                return 1 + stack.get_entry_depth(id, abort)
            }
            return 0
        },
    })
}
