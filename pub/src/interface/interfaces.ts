import { Raw_Optional_Value } from "./Raw_Optional_Value"
import { Transformer } from "./algorithm_signatures/Transformer"
import { Circular_Dependency } from "./data/Circular_Dependency"

export type Abort<Error> = (error: Error) => never

export type Acyclic_Lookup<Type> = {
    'get entry': (
        key: string,
        abort: {
            'no context lookup': Abort<null>,
            'no such entry': Abort<string>,
            'cyclic': Abort<string[]>,
        }
    ) => Type
    'get possible entry': (
        key: string,
        abort: {
            'no context lookup': Abort<null>,
            'cyclic': Abort<string[]>,
        }
    ) => Raw_Optional_Value<Type>
}

export type Cyclic_Lookup<Type> = {
    'get entry': (
        key: string,
        abort: {
            'no context lookup': Abort<null>,
            'no such entry': Abort<string>,
            'accessing cyclic before resolved': Abort<null>,
        }
    ) => Circular_Dependency<Type>
}

export type Iterator<Element> = {
    'look': () => Raw_Optional_Value<Element>,
    'look ahead': (offset: number) => Raw_Optional_Value<Element>
    'consume': <T>(
        callback: (value: Element, position: number) => T,
        abort: Abort<number>
    ) => T,
    'discard': <T>(
        callback: () => T
    ) => T,
    'get position': () => number,
    'assert finished': <T>(
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
    'get entry': (
        key: string,
        abort: {
            'no context lookup': Abort<null>,
            'no such entry': Abort<string>,
            'cyclic': Abort<string[]>,
        }
    ) => Type
}

export type Text_Builder = {
    'add snippet': ($: string) => void
    'add character': ($: number) => void
}