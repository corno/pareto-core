import query from "./query"
import query_function from "./query_function"
import __query_result from "./__query_result"

import * as p_di from "../../data/interface"
import * as p_qi from "../interface"

export {
    query,
    query_function,
    __query_result,
}

export * from "../../__internals/sync/literal"
export * from "./query_expression"
export * from "./query_function"
export * from "./__query_result"
export * from "./query"

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