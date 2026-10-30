import type * as p_di from "../../schema.js"
import { type Abort } from "../../__internal/Abort.js"
import { type Raw_Optional_Value } from "../../__internal/Raw_Optional_Value.js"

export type Acyclic<Type extends p_di.Value> = {
    get_entry: (
        id: string,
        abort: {
            no_such_entry: Abort<null>
            no_context_lookup: Abort<null>
            cycle_detected: Abort<p_di.List<string>>
        },
    ) => Type
    __get_entry_raw: (
        id: string,
        abort: {
            no_context_lookup: Abort<null>
            cycle_detected: Abort<p_di.List<string>>
        },
    ) => Raw_Optional_Value<Type>
}

export type Cyclic<Type extends p_di.Value> = {
    get_entry: (
        id: string,
        abort: {
            no_such_entry: Abort<string>
            no_context_lookup: Abort<null>
            accessing_cyclic_sibling_before_it_is_resolved: Abort<null>
        },
    ) => p_di.Circular_Dependency<Type>
}

export type Stack<Type extends p_di.Value> = {
    get_entry: (
        id: string,
        abort: {
            no_context_lookup: Abort<null>
            no_such_entry: Abort<string>
            cycle_detected: Abort<p_di.List<string>>
        },
    ) => Type
    get_entry_depth: (
        id: string,
        abort: {
            no_context_lookup: Abort<null>
            no_such_entry: Abort<string>
            cycle_detected: Abort<p_di.List<string>>
        },
    ) => number
}
