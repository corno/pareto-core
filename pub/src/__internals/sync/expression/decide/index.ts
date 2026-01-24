import * as _pi from "../../../../interface"
import { $$ as list_literal } from "../literals/list"


/**
 * cc means 'change context'. It creates a new scope in which a variable name can be used again
 * (usually '$', a variable name that indicates the current context in exupery)
 * 
 * example: 
 * 
 * cc($[1], ($) => {
 *     //here $[1] has become $
 * })
 * 
 * @param input 
 * @param callback 
 * @returns 
 */

export function sg<T extends readonly [string, any], RT>(input: T, callback: (output: T) => RT): RT {
    return callback(input)
}


export type State<T> = readonly [string, T]

/**
 * ss means 'switch state'.
 * used to make the value T the context variable ('$')
 * given a tuple of a string (or boolean) and a value T,
 * the function takes the value T and calls back the callback ($c)
 * notice that the string part is never used
 * 
 * example:
 * 
 * switch ($.state[0]) {
 *     case "on":
 *          return ss($.state, ($) => $.value
 *     case "off":
 *          return ss($.state, ($) => null
 *     default: au($.state[0])
 * }
 */
export function ss<T, RT>(
    $: State<T>,
    $c: ($: T) => RT): RT {
    return $c($[1])
}

/**
 * au means 'assert unreachable'. Used in the 'default' clause of switch statements to ensure
 * during compile time that all possible cases have been implemented
 * 
 * example: 
 * 
 * switch (x) {
 *     case "5":
 *         break
 *     default: au(x)
 * }
 * 
 * @param _x 
 */
export function au<RT>(_x: never): RT {
    throw new Error("unreachable")
}

export namespace dictionary {

    export const has_entries = <T>(
        $: _pi.Dictionary<T>,
        if_true: ($: _pi.Dictionary<T>) => T,
        if_not_true: () => T
    ): T => $.__get_number_of_entries() === 0
            ? if_true($)
            : if_not_true()
}

export namespace list {

    export const has_first_element = <T, RT>(
        list: _pi.List<T>,
        if_true: ($: T, rest: _pi.List<T>) => RT,
        if_not_true: () => RT
    ): RT => list.__get_possible_element_at(0).__decide(
        ($) => if_true($, list_literal(list.__get_raw_copy().slice(1))),
        () => if_not_true(),
    )

    export const has_last_element = <T, RT>(
        list: _pi.List<T>,
        if_true: ($: T, rest: _pi.List<T>) => RT,
        if_not_true: () => RT
    ): RT => list.__get_possible_element_at(list.__get_number_of_elements() - 1).__decide(
        ($) => if_true($, list_literal(list.__get_raw_copy().slice(0, -1))),
        () => if_not_true(),
    )

    export const has_elements = <T>(
        list: _pi.List<T>,
        if_true: ($: _pi.List<T>) => T,
        if_not_true: () => T
    ): T => list.__get_number_of_elements() === 0
            ? if_true(list)
            : if_not_true()
            
}

export const optional = <T, RT>(
    $: _pi.Optional_Value<T>,
    if_set: ($: T) => RT,
    if_not_set: () => RT
): RT => $.__decide(if_set, if_not_set)