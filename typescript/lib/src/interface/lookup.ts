import * as p_di from "../data/interface"
import { Abort } from "./Abort"

export namespace static_lookup {

    export type Acyclic<Type extends p_di.Value> = {
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
        ) => p_di.Raw_Optional_Value<Type>
    }

    export type Cyclic<Type extends p_di.Value> = {
        get_entry: (
            id: string,
            abort: {
                no_such_entry: Abort<string>,
                no_context_lookup: Abort<null>,
                accessing_cyclic_sibling_before_it_is_resolved: Abort<null>,
            }
        ) => p_di.Circular_Dependency<Type>
    }

    export type Stack<Type extends p_di.Value> = {
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

    export type Acyclic<Type extends p_di.Value> = {
        map_possible_entry: <Out extends p_di.Value>(
            id: string,
            handlers: {
                found_entry: ($: Type) => Out,
                no_such_entry: ($: string) => Out,
                no_context_lookup: () => Out,
                cycle_detected: ($: string[]) => Out,
            }
        ) => Out
    }

    export type Cyclic<Type extends p_di.Value> = {
        map_possible_entry: <Out extends p_di.Value>(
            id: string,
            handlers: {
                found_entry: ($: Type) => Out,
                no_such_entry: ($: string) => Out,
                no_context_lookup: () => Out,
                accessing_cyclic_sibling_before_it_is_resolved: () => Out,
            }
        ) => p_di.Circular_Dependency<Out>
    }

    export type Stack<Type extends p_di.Value> = {
        // get_entry_depth: (
        //     id: string,
        //     abort: {
        //         no_context_lookup: p_di.Abort<null>,
        //         no_such_entry: p_di.Abort<string>,
        //         cycle_detected: p_di.Abort<string[]>,
        //     }
        // ) => number
        map_possible_entry: <Out extends p_di.Value>(
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