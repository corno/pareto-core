import * as _pi from "./interface"


export namespace acyclic {

    export const not_set = <T>(
    ): _pi.dynamic_lookup.Acyclic<T> => ({
        map_possible_entry: (id, handlers) => handlers.no_context_lookup(),
    })

    export const from_resolved_dictionary = <T>(
        dict: _pi.Dictionary<T>,
    ): _pi.dynamic_lookup.Acyclic<T> => ({
        map_possible_entry: (id, handlers) => dict.__get_possible_entry_deprecated(id).__decide(
            ($) => handlers.found_entry($),
            () => handlers.no_such_entry(id),
        ),
    })

}

export namespace cyclic {

    export const not_set = <T>(
    ): _pi.dynamic_lookup.Cyclic<T> => ({
        map_possible_entry: (id, handlers) => {
            //return abort['no context dynamic_lookup']()
            return {
                'get_circular_dependent': () => handlers.no_context_lookup(),
            }
        }
    })

}

export namespace stack {

    export const empty = <T>(
    ): _pi.dynamic_lookup.Stack<T> => ({
        map_possible_entry: (id, handlers) => handlers.no_context_lookup(),
    })

    export const push = <T>(
        stack: _pi.dynamic_lookup.Stack<T>,
        item: _pi.dynamic_lookup.Acyclic<T>,
    ): _pi.dynamic_lookup.Stack<T> => {
        return ({
            map_possible_entry: (id, handlers) => item.map_possible_entry(
                id,
                {
                    found_entry: ($) => handlers.found_entry($),
                    no_such_entry: () => stack.map_possible_entry(
                        id,
                        {
                            found_entry: ($) => handlers.found_entry($),
                            no_such_entry: () => handlers.no_such_entry(id),
                            no_context_lookup: () => handlers.no_context_lookup(),
                            cycle_detected: (cycle) => handlers.cycle_detected(cycle),
                        },
                    ),
                    no_context_lookup: () => handlers.no_context_lookup(),
                    cycle_detected: (cycle) => handlers.cycle_detected(cycle),
                },
            )
        })
    }

}