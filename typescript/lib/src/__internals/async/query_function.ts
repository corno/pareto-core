import * as _pqi from "../../query/interface"

import __query from "./query"
import __query_result from "./__query_result"

export default function query_function<
    Result,
    Error,
    Dynamic_Parameters extends _pqi.Parameters,
    Static_Parameters extends _pqi.Parameters,
    Query_Resources extends null | { [key: string]: _pqi.Query<any, any, any> },
>(
    handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $q: Query_Resources,
    ) => _pqi.Query_Result<
        Result,
        Error
    >
): _pqi.Query_Function<
    _pqi.Query<
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