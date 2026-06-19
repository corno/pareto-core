import * as p_i from "../../../interface/query"
import * as p_di from "../../../interface/data"

import query_result from "./query_result"


export type Query_Callback<
    Output extends p_di.Value,
    Error extends p_di.Value,
    Input extends p_di.Value
> = (
    $: Input,
) => p_i.Query_Result<Output, Error>

export default function __query<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value>(
        handler: Query_Callback<Result, Error, Dynamic_Parameters>,
    ): p_i.Query<Result, Error, Dynamic_Parameters> {
    return (parameters, error_transformer) => query_result((on_success, on_error) => {
        handler(parameters).__extract_data(
            on_success,
            (e) => {
                on_error(error_transformer(e))
            },
        )
    })
}