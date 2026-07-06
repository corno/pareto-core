import * as p_di from "../../../interface/data.js"

export type Option<T extends p_di.Value> = readonly [string, T]
/**
 * ss means 'switch state'.
 * used to make the value T the context variable ('$')
 * given a tuple of a string and a value T,
 * the function takes the value T and calls back the callback ($c)
 * notice that the string part is never used
 * 
 * example:
 * 
 * switch ($.state[0]) {
 *     case 'on':
 *          return ss($.state, ($) => $.value)
 *     case 'off':
 *          return ss($.state, ($) => null)
 *     default: return au($.state[0])
 * }
 * @deprecated use 'option' instead
 */
export function ss<T extends p_di.Value, RT extends p_di.Value>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}
export function option<T extends p_di.Value, RT extends p_di.Value>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

/**
 * au means 'assert unreachable'. Used in the 'default' clause of switch statements to ensure
 * during compile time that all possible cases have been implemented
 * 
 * example: 
 * 
 * switch (x) {
 *     case '5':
 *         return 5
 *     default: return au(x)
 * }
 * 
 * @param _x 
 */
export function au<RT>(
    _x: never
): RT {
    throw new Error("unreachable")
}