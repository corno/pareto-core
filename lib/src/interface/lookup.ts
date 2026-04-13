import { Raw_Optional_Value } from "./Raw_Optional_Value"
import { Circular_Dependency } from "./data/Circular_Dependency"
import { Abort } from "./abort"

export namespace lookup {

    export type Acyclic<Type> = {
        get_entry: (
            id: string,
            abort: {
                no_such_entry: Abort<null>,
                no_context_lookup: Abort<null>,
                cycle_detected: Abort<string[]>,
            }
        ) => Type
        __get_entry_raw: (
            id: string,
            abort: {
                no_context_lookup: Abort<null>,
                cycle_detected: Abort<string[]>,
            }
        ) => Raw_Optional_Value<Type>
    }

    export type Cyclic<Type> = {
        get_entry: (
            id: string,
            abort: {
                no_such_entry: Abort<string>,
                no_context_lookup: Abort<null>,
                accessing_cyclic_sibling_before_it_is_resolved: Abort<null>,
            }
        ) => Circular_Dependency<Type>
    }

    export type Stack<Type> = {
        get_entry: (
            id: string,
            abort: {
                no_context_lookup: Abort<null>,
                no_such_entry: Abort<string>,
                cycle_detected: Abort<string[]>,
            }
        ) => Type
        get_entry_depth: (
            id: string,
            abort: {
                no_context_lookup: Abort<null>,
                no_such_entry: Abort<string>,
                cycle_detected: Abort<string[]>,
            }
        ) => number
    }

}