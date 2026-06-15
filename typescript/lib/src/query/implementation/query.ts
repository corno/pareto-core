import * as p_i from "../interface"

import __query_result from "./__query_result"


export default function __query<
    Result,
    Error,
    Dynamic_Parameters extends p_i.Parameters>(
        handler: p_i.Query_Callback<Result, Error, Dynamic_Parameters>,
    ): p_i.Query<Result, Error, Dynamic_Parameters> {
    return (parameters, error_transformer) => __query_result((on_success, on_error) => {
        handler(parameters).__extract_data(
            on_success,
            (e) => {
                on_error(error_transformer(e))
            },
        )
    })
}