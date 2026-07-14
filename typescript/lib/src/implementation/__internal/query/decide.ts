
import * as p_di from "../../../interface/data.js"

import { type Query_Result } from "../../../interface/__internal/query/Query_Result.js"

export type Option<T extends p_di.Value> = readonly [string, T]

/**
 * @deprecated use 'option' instead
 */
export function ss<
    T extends p_di.Value,
    Output extends p_di.Value,
    Error extends p_di.Value,
>(
    option: Option<T>,
    $c: ($: T) => Query_Result<Output, Error>): Query_Result<Output, Error> {
    return $c(option[1])
}

export function option<
    T extends p_di.Value,
    Output extends p_di.Value,
    Error extends p_di.Value,
>(
    option: Option<T>,
    $c: ($: T) => Query_Result<Output, Error>): Query_Result<Output, Error> {
    return $c(option[1])
}

/**
 * 
 * @deprecated use exhaustive instead
 */
export function au<
    Output extends p_di.Value,
    Error extends p_di.Value,
>(
    _x: never
): Query_Result<Output, Error> {
    throw new Error("unreachable")
}

export function exhaustive<
    Output extends p_di.Value,
    Error extends p_di.Value,
>(
    _x: never
): Query_Result<Output, Error> {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends p_di.State,
        Output extends p_di.Value,
        Error extends p_di.Value,
    >(
        state: T,
        assign: (output: T) => Query_Result<Output, Error>
    ): Query_Result<Output, Error> => {
        return assign(state)
    }

}