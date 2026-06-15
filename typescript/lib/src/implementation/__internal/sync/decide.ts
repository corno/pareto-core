import * as p_di from "../../../interface/data"
import { List_Class } from "./assign/literals/List"

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
 */


    export const boolean = <RT>(
        boolean_value: boolean,
        if_true: () => RT,
        if_false: () => RT
    ): RT => boolean_value
            ? if_true()
            : if_false()



    export const dictionary = <T extends p_di.Value>(
        dictionary: p_di.Dictionary<T>,
    ) => {
        return {

            contains_entry: <RT extends p_di.Value>(
                id: string,
                if_true: ($: T) => RT,
                if_not_true: () => RT
            ): RT => dictionary.__get_possible_entry_deprecated(id).__decide(
                ($) => if_true($),
                () => if_not_true(),
            ),

            has_entries: <RT extends p_di.Value>(
                if_true: ($: p_di.Dictionary<T>) => RT,
                if_not_true: () => RT
            ): RT => dictionary.__get_number_of_entries() !== 0
                    ? if_true(dictionary)
                    : if_not_true(),

            has_single_entry: <RT extends p_di.Value>(
                if_true: ($: T, id: string) => RT,
                if_multiple: ($: p_di.Dictionary<T>) => RT,
                if_none: () => RT,
            ): RT => {
                return list(dictionary.__to_list(($, id) => ({ 'id': id, 'value': $ }))).has_single_item(
                    (item) => if_true(item.value, item.id),
                    () => if_multiple(dictionary),
                    if_none,
                )
            }
        }

    }

    export const list = <T extends p_di.Value>(
        list: p_di.List<T>,
    ) => {
        return {

            has_first_item: <RT extends p_di.Value>(
                if_true: ($: T, rest: p_di.List<T>) => RT,
                if_not_true: () => RT
            ): RT => list.__deprecated_get_possible_item_at(0).__decide(
                ($) => if_true($, new List_Class(list.__get_raw_copy().slice(1))),
                () => if_not_true(),
            ),

            has_items: <RT extends p_di.Value>(
                if_true: ($: p_di.List<T>) => RT,
                if_not_true: () => RT
            ): RT => list.__get_number_of_items() !== 0
                    ? if_true(list)
                    : if_not_true(),

            has_last_item: <RT extends p_di.Value>(
                if_true: ($: T, rest: p_di.List<T>) => RT,
                if_not_true: () => RT
            ): RT => list.__deprecated_get_possible_item_at(list.__get_number_of_items() - 1).__decide(
                ($) => if_true($, new List_Class(list.__get_raw_copy().slice(0, -1))),
                () => if_not_true(),
            ),

            has_match: <RT extends p_di.Value>(
                test: ($: T) => p_di.Optional_Value<RT>,
                if_no_match: () => RT,
            ): RT => {
                const raw = list.__get_raw_copy()
                for (let i = 0; i < raw.length; i++) {
                    const item = raw[i]
                    const result = test(item).__get_raw()
                    if (result !== null) {
                        return result[0]
                    }
                }
                return if_no_match()
            },

            has_single_item: <RT extends p_di.Value>(
                if_true: ($: T) => RT,
                if_multiple: ($: p_di.List<T>) => RT,
                if_none: () => RT,
            ): RT => {
                return (list.__get_number_of_items() > 1)
                    ? if_multiple(list)
                    : list.__deprecated_get_possible_item_at(0).__decide(
                        ($) => if_true($),
                        () => if_none(),
                    )
            },

        }
    }

    export const optional = <T extends p_di.Value, RT extends p_di.Value>(
        optional: p_di.Optional_Value<T>,
        if_set: ($: T) => RT,
        if_not_set: () => RT
    ): RT => optional.__decide(if_set, if_not_set)

    export const state = <T extends p_di.State, RT extends p_di.Value>(
        state: T,
        assign: (output: T) => RT
    ): RT => {
        return assign(state)
    }

    export const text = <RT extends p_di.Value>(
        text: string,
        assign: (
            output: string
        ) => RT
    ): RT => {
        return assign(text)
    }