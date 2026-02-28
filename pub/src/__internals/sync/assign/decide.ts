import * as _pi from "../../../interface"
import { List_Class } from "./literals/List"
import { Not_Set_Optional_Value } from "./literals/Optional"

export type Option<T> = readonly [string, T]

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
 */
export function ss<T, RT>(
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

export namespace decide {

    export const boolean = <RT>(
        boolean_value: boolean,
        if_true: () => RT,
        if_false: () => RT
    ): RT => boolean_value
            ? if_true()
            : if_false()

    export namespace dictionary {

        export const has_entries = <T, RT>(
            dictionary: _pi.Dictionary<T>,
            if_true: ($: _pi.Dictionary<T>) => RT,
            if_not_true: () => RT
        ): RT => dictionary.__get_number_of_entries() !== 0
                ? if_true(dictionary)
                : if_not_true()

    }

    export const list = <T>(
        list: _pi.List<T>,
    ) => {
        return {

            has_first_item: <RT>(
                if_true: ($: T, rest: _pi.List<T>) => RT,
                if_not_true: () => RT
            ): RT => list.__deprecated_get_possible_item_at(0).__decide(
                ($) => if_true($, new List_Class(list.__get_raw_copy().slice(1))),
                () => if_not_true(),
            ),

            has_items: <RT>(
                if_true: ($: _pi.List<T>) => RT,
                if_not_true: () => RT
            ): RT => list.__get_number_of_items() !== 0
                    ? if_true(list)
                    : if_not_true(),

            has_last_item: <RT>(
                if_true: ($: T, rest: _pi.List<T>) => RT,
                if_not_true: () => RT
            ): RT => list.__deprecated_get_possible_item_at(list.__get_number_of_items() - 1).__decide(
                ($) => if_true($, new List_Class(list.__get_raw_copy().slice(0, -1))),
                () => if_not_true(),
            ),

            has_match: <RT>(
                test: ($: T) => _pi.Optional_Value<RT>,
            ): _pi.Optional_Value<RT> => {
                const raw = list.__get_raw_copy()
                for (let i = 0; i < raw.length; i++) {
                    const item = raw[i]
                    const result = test(item)
                    if (result.__get_raw() !== null) {
                        return result
                    }
                }
                return new Not_Set_Optional_Value<RT>()
            },

            has_single_item: <RT>(
                if_true: ($: T) => RT,
                if_multiple: ($: _pi.List<T>) => RT,
                if_none: () => RT,
            ): RT => {
                return list.__get_number_of_items() > 2
                    ? if_multiple(list)
                    : list.__deprecated_get_possible_item_at(0).__decide(
                        ($) => if_true($),
                        () => if_none(),
                    )
            }

        }
    }

    export const optional = <T, RT>(
        optional: _pi.Optional_Value<T>,
        if_set: ($: T) => RT,
        if_not_set: () => RT
    ): RT => optional.__decide(if_set, if_not_set)

    export const state = <T extends readonly [string, any], RT>(
        state: T,
        assign: (output: T) => RT
    ): RT => {
        return assign(state)
    }

    export const text = <RT>(
        text: string,
        assign: (
            output: string
        ) => RT
    ): RT => {
        return assign(text)
    }

}