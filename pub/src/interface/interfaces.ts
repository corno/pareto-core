import { Raw_Optional_Value } from "./Raw_Optional_Value"
import { Transformer } from "./algorithm_signatures/Transformer"
import { Circular_Dependency } from "./data/Circular_Dependency"

export type Abort<Error> = (error: Error) => never

export type Acyclic_Lookup<Type> = {
    get_entry: (
        key: string,
        abort: {
            no_context_lookup: Abort<null>,
            no_such_entry: Abort<string>,
            cyclic: Abort<string[]>,
        }
    ) => Type
    __get_entry_raw: (
        key: string,
        abort: {
            no_context_lookup: Abort<null>,
            cyclic: Abort<string[]>,
        }
    ) => Raw_Optional_Value<Type>
}

export type Cyclic_Lookup<Type> = {
    get_entry: (
        key: string,
        abort: {
            no_context_lookup: Abort<null>,
            no_such_entry: Abort<string>,
            accessing_cyclic_before_resolved: Abort<null>,
        }
    ) => Circular_Dependency<Type>
}

export type Iterator<Element> = {
    look: () => Raw_Optional_Value<Element>,
    look_ahead: (offset: number) => Raw_Optional_Value<Element>
    consume: <T>(
        callback: (value: Element, position: number) => T,
        abort: Abort<number>
    ) => T,
    discard: <T>(
        callback: () => T
    ) => T,
    get_position: () => number,
    assert_finished: <T>(
        callback: () => T,
        abort: Abort<null>
    ) => T
}

export type Queryer<Output, Error, Input> = (
    $: Input,
) => Query_Result<Output, Error>

//Shoutout to Reinout for helping me with the naming here :)

export interface Query_Result<Output, Error> {
    query_result: null

    transform_result<New_Output>(
        transformer: Transformer<Output, New_Output>
    ): Query_Result<New_Output, Error>

    query_without_error_transformation<New_Output>(
        query: Queryer<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>

    refine_without_error_transformation<New_Output>(
        callback: ($: Output, abort: Abort<Error>) => New_Output,
    ): Query_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Queryer<New_Error, Rework_Error, Error>,
        /**
         * if the reworker fails, we need to transform *that* error into the New_Error
         */
        rework_error_transformer: Transformer<Rework_Error, New_Error>,
    ): Query_Result<Output, New_Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

export type Stack_Lookup<Type> = {
    get_entry: (
        key: string,
        abort: {
            no_context_lookup: Abort<null>,
            no_such_entry: Abort<string>,
            cyclic: Abort<string[]>,
        }
    ) => Type
    get_entry_depth: (
        key: string,
    ) => number
}

export type Text_Builder = {
    add_snippet: ($: string) => void
    add_character: ($: number) => void
}