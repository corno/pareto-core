import * as _pi from "../../interface"
import { Query_Result } from "./Query_Result"
import { __query_result } from "./__query_result"


type Queryer<Output, Error, Input> = (
    $: Input,
) => Query_Result<Output, Error>

export const __query = <Result, Error, Parameters, Resources>(
    handler: Queryer<Result, Error, Parameters>,
): _pi.Query<Result, Error, Parameters> => (parameters, error_transformer) => __query_result((on_success, on_error) => {
    handler(parameters).__extract_data(
        on_success,
        (e) => {
            on_error(error_transformer(e))
        },
    )
})