import * as p_i from "../../../interface/query_implementation.js"
import * as p_di from "../../../interface/data.js"

import { type Query_Interface } from "../../../interface/__internal/query/Query_Interface.js"

import query_result from "./query_result.js"

export default function <
    Result extends p_di.Value,
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value
>(
    handler: (
        $: Dynamic_Parameters,
    ) => p_i.Query_Result<Result, Error>,
): Query_Interface<
    Result,
    Error,
    Dynamic_Parameters
> {
    return (parameters, error_transformer) => query_result((on_success, on_error) => {
        handler(parameters).__extract_data(
            on_success,
            (e) => {
                on_error(error_transformer(e))
            },
        )
    })
}