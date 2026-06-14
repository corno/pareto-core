import * as _pi from "../../query_interface"

import __query_result from "./__query_result"


export default function __query<
    Result,
    Error,
    Dynamic_Parameters extends _pi.Parameters>(
        handler: _pi.Query_Callback<Result, Error, Dynamic_Parameters>,
    ): _pi.Query<Result, Error, Dynamic_Parameters> {
    return (parameters, error_transformer) => __query_result((on_success, on_error) => {
        handler(parameters).__extract_data(
            on_success,
            (e) => {
                on_error(error_transformer(e))
            },
        )
    })
}