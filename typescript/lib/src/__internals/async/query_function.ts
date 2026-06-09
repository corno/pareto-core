import * as _pi from "../../interface"

import __query from "./query"
import __query_result from "./__query_result"
import { Query_Result } from "./Query_Result"

export default function query_function<
    Result,
    Error,
    Parameters,
    Query_Resources,
    Context_Parameters
>(
    handler: (
        $p: Parameters,
        $q: Query_Resources,
        $x: Context_Parameters
    ) => Query_Result<
        Result,
        Error
    >
): _pi.Query_Function<
    _pi.Query<
        Result,
        Error,
        Parameters
    >,
    Query_Resources,
    Context_Parameters
> {
    return ($q, $x) => ($p, error_transformer) => {
        return __query_result((on_success, on_error) => {
            handler($p, $q, $x).__extract_data(
                on_success,
                (e) => {
                    on_error(error_transformer(e))
                },
            )
        })
    }
}