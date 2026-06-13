import * as _pi from "../../interface"

import { Query_Result } from "../../interface/algorithm_signatures/Query_Result"
import __query_result from "./__query_result"
import { Parameters } from "../../interface/Parameters"

type Queryer<Output, Error, Input> = (
    $: Input,
) => Query_Result<Output, Error>

export default function __query<
    Result,
    Error,
    Dynamic_Parameters extends Parameters>(
        handler: Queryer<Result, Error, Dynamic_Parameters>,
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