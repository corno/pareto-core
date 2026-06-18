import * as p_di from "../../interface/data"
import * as p_ti from "../../interface/transformer"


export namespace acyclic {

    export const not_set = <T extends p_di.Value>(
    ): p_ti.lookup.Acyclic<T> => ({
        map_possible_entry: (id, handlers) => handlers.no_context_lookup(),
    })

    export const from_resolved_dictionary = <T extends p_di.Value>(
        dict: p_di.Dictionary<T>,
    ): p_ti.lookup.Acyclic<T> => ({
        map_possible_entry: (id, handlers) => dict.__get_possible_entry_deprecated(id).__decide(
            ($) => handlers.found_entry($),
            () => handlers.no_such_entry(id),
        ),
    })

}

export namespace cyclic {

    export const not_set = <T extends p_di.Value>(
    ): p_ti.lookup.Cyclic<T> => ({
        map_possible_entry: (id, handlers) => {
            //return abort['no context dynamic_lookup']()
            return {
                'get_circular_dependent': () => handlers.no_context_lookup(),
            }
        }
    })

}

export namespace stack {

    export const empty = <T extends p_di.Value>(
    ): p_ti.lookup.Stack<T> => ({
        map_possible_entry: (id, handlers) => handlers.no_context_lookup(),
    })

    export const push = <T extends p_di.Value>(
        stack: p_ti.lookup.Stack<T>,
        item: p_ti.lookup.Acyclic<T>,
    ): p_ti.lookup.Stack<T> => {
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