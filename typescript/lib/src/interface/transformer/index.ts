import * as p_di from "../data"
import { Value } from "../data"

export type Transformer<
    Input extends p_di.Value,
    Result extends p_di.Value
> = (
    $: Input,
) => Result

export type Transformer_With_Parameter<
    Input extends p_di.Value,
    Result extends p_di.Value, 
    Parameter extends p_di.Value,
> = (
    $: Input,
    $p: Parameter,
) => Result


export namespace lookup {

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