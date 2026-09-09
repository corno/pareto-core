import * as p_di from "../../schema.js"

import { type Query_Interface } from "../../interface/__internal/query/Query_Interface.js"
import { type Query_Implementation } from "../../interface/__internal/query/Query_Implementation.js"
import { type Query_Result } from "../../interface/__internal/query/Query_Result.js"
import { Super_Query_Result_Class } from "../../query/super_query_result.js"

import query_result from "./query_result.js"

export default function <
    Result extends p_di.Value,
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value,
    Static_Parameters extends p_di.Value,
    Query_Resources extends null | { [key: string]: Query_Interface<any, any, any> },
>(
    handler: (
        e: Super_Query_Result_Class<
            Dynamic_Parameters,
            Error
        >,
        $s: Static_Parameters,
        $q: Query_Resources,
        $d: {
            'deprecated': Dynamic_Parameters
        },
    ) => Query_Result<
        Result,
        Error
    >
): Query_Implementation<
    Query_Interface<
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
                handler(
                    new Super_Query_Result_Class<Dynamic_Parameters, Error>(
                        (on_result, on_error) => {
                            on_result($d)
                            return undefined
                        }
                    ),
                    $s,
                    $q,
                    {
                        'deprecated': $d
                    }
                ).__extract_data(
                    on_success,
                    (e) => {
                        on_error(error_transformer(e))
                    },
                )
            }
        )
    }
}