import query from "./query"
import query_function from "./query_function"
import query_result from "./query_result"

import * as p_di from "../../interface/data"
import * as p_qi from "../../interface/query"

export {
    query,
    query_function,
    query_result,
}

export * as literal from "../__internal/sync/literal"
export * from "./query_expression"
export * from "./query_function"
export * from "./query_result"
export * from "./query"
export * from "../../interface/query/Query_Result" //useful for cases where typescript cannot infer the type

export type Option<T extends p_di.Value> = readonly [string, T]

export function ss<T extends p_di.Value, RT extends p_qi.Query_Result<any, any>>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

export function au<RT extends p_qi.Query_Result<any, any>>(
    _x: never
): RT {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends p_di.State,
        RT extends p_qi.Query_Result<any, any>
    >(
        state: T,
        assign: (output: T) => RT
    ): RT => {
        return assign(state)
    }

}