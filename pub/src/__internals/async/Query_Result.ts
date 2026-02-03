import * as _pi from "../../interface"

export type Queryer<Output, Error, Input> = (
    $: Input,
) => Query_Result<Output, Error>

//Shoutout to Reinout for helping me with the naming here :)

export interface Query_Result<Output, Error> {
    query_result: null

    transform_result<New_Output>(
        transformer: _pi.Transformer<Output, New_Output>
    ): Query_Result<New_Output, Error>

    query_without_error_transformation<New_Output>(
        query: Queryer<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>

    refine_without_error_transformation<New_Output>(
        callback: ($: Output, abort: _pi.Abort<Error>) => New_Output,
    ): Query_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Queryer<New_Error, Rework_Error, Error>,
        /**
         * if the reworker fails, we need to transform *that* error into the New_Error
         */
        rework_error_transformer: _pi.Transformer<Rework_Error, New_Error>,
    ): Query_Result<Output, New_Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}