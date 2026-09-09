import * as p_di from "../../schema.js"

export type Option<T extends p_di.Value> = readonly [string, T]
/**
 * used to make the value T the context variable ('$')
 * given a tuple of a string and a value T,
 * the function takes the value T and calls back the callback ($)
 * notice that the string part is never used
 * 
 * example:
 * 
 * switch ($.state[0]) {
 *     case 'on': return p_.option($.state, ($) => $.value)
 *     case 'off': return p_.option($.state, ($) => null)
 *     default: return p_.exhaustive($.state[0])
 * }
 */
export function option<T extends p_di.Value, RT extends p_di.Value>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

export function exhaustive<RT>(
    _x: never
): RT {
    throw new Error("unreachable")
}