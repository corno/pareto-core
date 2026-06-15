import * as p_qi from "../../interface/query"

import __query from "./query"
import __query_result from "./__query_result"

export default function query_function<
    Result,
    Error,
    Dynamic_Parameters extends p_qi.Parameters,
    Static_Parameters extends p_qi.Parameters,
    Query_Resources extends null | { [key: string]: p_qi.Query<any, any, any> },
>(
    handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $q: Query_Resources,
    ) => p_qi.Query_Result<
        Result,
        Error
    >
): p_qi.Query_Function<
    p_qi.Query<
        Result,
        Error,
        Dynamic_Parameters
    >,
    Static_Parameters,
    Query_Resources
> {
    return ($s, $q) => (
        $d,
        error_transformer
    ) => {
        return __query_result(
            (
                on_success,
                on_error
            ) => {
                handler($d, $s, $q).__extract_data(
                    on_success,
                    (e) => {
                        on_error(error_transformer(e))
                    },
                )
            }
        )
    }
}