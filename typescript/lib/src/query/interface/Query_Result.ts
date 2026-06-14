import { Transformer } from "../../interface/algorithm_signatures/Transformer"
import { Abort } from "../../interface/Abort"

export type Query_Callback<Output, Error, Input> = (
    $: Input,
) => Query_Result<Output, Error>

//Shoutout to Reinout for helping me with the naming here :)

export interface Query_Result<Output, Error> {
    __query_result: null // I think I added this to prevent accidental duck-type conversions from other types to Query Result

    transform<New_Output>(
        transformer: Transformer<Output, New_Output>
    ): Query_Result<New_Output, Error>

    query<New_Output>(
        query: Query_Callback<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>

    refine<New_Output>(
        callback: ($: Output, abort: Abort<Error>) => New_Output,
    ): Query_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Query_Callback<New_Error, Rework_Error, Error>,
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