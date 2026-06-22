import * as p_di from "../data"

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

    export type Exception_Callback<
        Type extends p_di.Value,
        Param extends p_di.Value,
    > = ($: Param) => p_di.Optional_Value<Type>

    export type Acyclic<Type extends p_di.Value> = {
        get_entry: (
            id: string,
            exception: {
                no_context_lookup: Exception_Callback<Type, null>,
                cycle_detected: Exception_Callback<Type, p_di.List<string>>,
            }
        ) => p_di.Optional_Value<Type>
    }

    export type Cyclic<Type extends p_di.Value> = {
        get_entry: (
            id: string,
            exception: {
                no_context_lookup: Exception_Callback<Type, null>,
                accessing_cyclic_sibling_before_it_is_resolved: Exception_Callback<Type, null>,
            }
        ) => p_di.Circular_Dependency<p_di.Optional_Value<Type>>
    }

    export type Stack<Type extends p_di.Value> = {
        get_entry: (
            id: string,
            exception: {
                no_context_lookup: Exception_Callback<Type, null>,
                cycle_detected: Exception_Callback<Type, p_di.List<string>>,
            }
        ) => p_di.Optional_Value<Type>
        get_entry_depth: (
            id: string,
            exception: {
                no_context_lookup: Exception_Callback<Type, null>,
                cycle_detected: Exception_Callback<Type, p_di.List<string>>,
            }
        ) => p_di.Optional_Value<number>
    }

}