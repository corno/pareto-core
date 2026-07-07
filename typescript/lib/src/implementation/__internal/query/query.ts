import * as p_di from "../../../interface/data.js"

import { type Query_Action } from "../../../interface/__internal/query/Query_Action.js"
import { type Query } from "../../../interface/__internal/query/Query.js"
import { type Query_Result } from "../../../interface/__internal/query/Query_Result.js"

import query_result from "./query_result.js"

export default function query_function<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value,
    Static_Parameters extends p_di.Value,
    Query_Resources extends null | { [key: string]: Query_Action<any, any, any> },
>(
    handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $q: Query_Resources,
    ) => Query_Result<
        Result,
        Error
    >
): Query<
    Query_Action<
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
        return query_result(
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