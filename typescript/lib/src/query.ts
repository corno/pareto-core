import query from "./__internals/async/query"
import query_function from "./__internals/async/query_function"
import __query_result from "./__internals/async/__query_result"

import * as _pi from "./interface"
import * as _pqi from "./query_interface"

export {
    query,
    query_function,
    __query_result,
}

export * from "./__internals/sync/extracts_for_async"
export * from "./__internals/async/query_expression"
export * from "./__internals/async/query_function"
export * from "./__internals/async/__query_result"
export * from "./__internals/async/query"

export type Option<T extends _pi.Value> = readonly [string, T]

export function ss<T extends _pi.Value, RT extends _pqi.Query_Result<any, any>>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

export function au<RT extends _pqi.Query_Result<any, any>>(
    _x: never
): RT {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends _pi.State,
        RT extends _pqi.Query_Result<any, any>
    >(
        state: T,
        assign: (output: T) => RT
    ): RT => {
        return assign(state)
    }

}