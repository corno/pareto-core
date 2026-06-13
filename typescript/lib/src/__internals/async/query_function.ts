import * as _pi from "../../interface"

import __query from "./query"
import __query_result from "./__query_result"
import { Query_Result } from "../../interface/algorithm_signatures/Query_Result"
import { Query } from "../../interface/algorithm_signatures/Query"
import { Parameters } from "../../interface/Parameters"

export default function query_function<
    Result,
    Error,
    Dynamic_Parameters extends Parameters,
    Static_Parameters extends Parameters,
    Query_Resources extends null | { [key: string]: _pi.Query<any, any, any> },
>(
    handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $q: Query_Resources,
    ) => Query_Result<
        Result,
        Error
    >
): _pi.Query_Function<
    Query<
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