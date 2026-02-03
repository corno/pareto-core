import * as _pi from "../../../interface"
import { $$ as list_literal } from "./literals/List"

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

export namespace decide {

    export const boolean = <RT>(
        $: boolean,
        if_true: () => RT,
        if_false: () => RT
    ): RT => $ ? if_true() : if_false()

    export namespace dictionary {

        export const has_entries = <T, RT>(
            $: _pi.Dictionary<T>,
            if_true: ($: _pi.Dictionary<T>) => RT,
            if_not_true: () => RT
        ): RT => $.__get_number_of_entries() !== 0
                ? if_true($)
                : if_not_true()

    }

    export namespace list {

        export const has_first_item = <T, RT>(
            list: _pi.List<T>,
            if_true: ($: T, rest: _pi.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__deprecated_get_possible_item_at(0).__decide(
            ($) => if_true($, list_literal(list.__get_raw_copy().slice(1))),
            () => if_not_true(),
        )

        export const has_last_item = <T, RT>(
            list: _pi.List<T>,
            if_true: ($: T, rest: _pi.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__deprecated_get_possible_item_at(list.__get_number_of_items() - 1).__decide(
            ($) => if_true($, list_literal(list.__get_raw_copy().slice(0, -1))),
            () => if_not_true(),
        )

        export const has_items = <T, RT>(
            list: _pi.List<T>,
            if_true: ($: _pi.List<T>) => RT,
            if_not_true: () => RT
        ): RT => list.__get_number_of_items() !== 0
                ? if_true(list)
                : if_not_true()

    }

    export const optional = <T, RT>(
        $: _pi.Optional_Value<T>,
        if_set: ($: T) => RT,
        if_not_set: () => RT
    ): RT => $.__decide(if_set, if_not_set)

    export const state = <T extends readonly [string, any], RT>(input: T, callback: (output: T) => RT): RT => {
        return callback(input)
    }

    export const text = <RT>(input: string, callback: (output: string) => RT): RT => {
        return callback(input)
    }

}