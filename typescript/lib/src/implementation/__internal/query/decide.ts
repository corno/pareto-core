
import * as p_di from "../../../interface/data.js"

import { type Query_Result } from "../../../interface/__internal/query/Query_Result.js"

export type Option<T extends p_di.Value> = readonly [string, T]

/**
 * @deprecated use 'option' instead
 */
export function ss<T extends p_di.Value, RT extends Query_Result<any, any>>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

export function option<T extends p_di.Value, RT extends Query_Result<any, any>>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

/**
 * 
 * @deprecated use exhaustive instead
 */
export function au<RT extends Query_Result<any, any>>(
    _x: never
): RT {
    throw new Error("unreachable")
}

export function exhaustive<RT extends Query_Result<any, any>>(
    _x: never
): RT {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends p_di.State,
        RT extends Query_Result<any, any>
    >(
        state: T,
        assign: (output: T) => RT
    ): RT => {
        return assign(state)
    }

}