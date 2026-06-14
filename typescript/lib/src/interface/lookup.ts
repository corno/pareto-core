import { Raw_Optional_Value } from "./Raw_Optional_Value"
import { Circular_Dependency } from "./data/Circular_Dependency"
import { Abort } from "./Abort"
import { Value } from "./data/Value"

export namespace static_lookup {

    export type Acyclic<Type extends Value> = {
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

    export type Cyclic<Type extends Value> = {
        get_entry: (
            id: string,
            abort: {
                no_such_entry: Abort<string>,
                no_context_lookup: Abort<null>,
                accessing_cyclic_sibling_before_it_is_resolved: Abort<null>,
            }
        ) => Circular_Dependency<Type>
    }

    export type Stack<Type extends Value> = {
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

export namespace dynamic_lookup {

    export type Acyclic<Type extends Value> = {
        map_possible_entry: <Out extends Value>(
            id: string,
            handlers: {
                found_entry: ($: Type) => Out,
                no_such_entry: ($: string) => Out,
                no_context_lookup: () => Out,
                cycle_detected: ($: string[]) => Out,
            }
        ) => Out
    }

    export type Cyclic<Type extends Value> = {
        map_possible_entry: <Out extends Value>(
            id: string,
            handlers: {
                found_entry: ($: Type) => Out,
                no_such_entry: ($: string) => Out,
                no_context_lookup: () => Out,
                accessing_cyclic_sibling_before_it_is_resolved: () => Out,
            }
        ) => Circular_Dependency<Out>
    }

    export type Stack<Type extends Value> = {
        // get_entry_depth: (
        //     id: string,
        //     abort: {
        //         no_context_lookup: Abort<null>,
        //         no_such_entry: Abort<string>,
        //         cycle_detected: Abort<string[]>,
        //     }
        // ) => number
        map_possible_entry: <Out extends Value>(
            id: string,
            handlers: {
                found_entry: ($: Type) => Out,
                no_context_lookup: () => Out,
                no_such_entry: ($: string) => Out,
                cycle_detected: ($: string[]) => Out,
            }
        ) => Out
    }

}