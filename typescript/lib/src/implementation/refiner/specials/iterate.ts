import * as p_di from "../../../interface/data"
import * as p_pi from "../../../interface/production"
import * as lit from "../../__internal/sync/literal"
import { Abort } from "../../../interface/__internal/Abort"
import * as from from "../__internal/from"

import { Raw_Optional_Value } from "../../../interface/__internal/Raw_Optional_Value"
import { Create_Expectation_Error } from "../../../interface/production/__internal/Iterator"


export default function iterate<
    Return_Type extends p_di.Value,
    Error extends p_di.Value,
    Expected extends p_di.Value,
    Item extends p_di.Value,
    End_Info extends p_di.Value,
>($$: {
    list: p_di.List<Item>,
    end_info: End_Info,
    abort: Abort<Error>,
    create_dangling_item_error: ($: Item) => p_di.Optional_Value<Error>,
    create_expectation_error: Create_Expectation_Error<
        Error,
        Expected,
        Item,
        End_Info>,
    assign: ($iter: p_pi.Iterator<Item, End_Info, Error, Expected>) => Return_Type,
}): Return_Type {

    const raw = $$.list.__get_raw()

    const length = raw.length

    let position = 0

    const look_raw = (): Raw_Optional_Value<Item> => {
        if (position < 0 || position >= raw.length) {
            return null
        }
        return [raw[position]]
    }

    const create_iterator = <
        The_Error extends p_di.Value,
        The_Expected extends p_di.Value
    >(
        transform_the_error: ($: The_Error) => Error,
        create_expectation_error: Create_Expectation_Error<
            The_Error,
            The_Expected,
            Item,
            End_Info
        >
    ): p_pi.Iterator<Item,
        End_Info,
        The_Error,
        The_Expected
    > => {
        return {
            abort: ($) => $$.abort(transform_the_error($)),
            expect: (
                $i,
            ) => {
                const next = look_raw()
                if (next === null) {
                    return $$.abort(transform_the_error(create_expectation_error(
                        $i.expected,
                        ['end', $$.end_info],
                    )))
                }
                return $i.item(
                    next[0],
                    ($) => $$.abort(
                        transform_the_error(
                            create_expectation_error(
                                $i.expected,
                                ['item', next[0]],
                            )
                        )
                    )
                )
            },
            to_new_iterator: <
                New_Error extends p_di.Value,
                New_Expected extends p_di.Value
            >(
                transform_error: ($: New_Error) => The_Error,
                cee: Create_Expectation_Error<
                    New_Error,
                    New_Expected,
                    Item,
                    End_Info
                >
            ) => {
                return create_iterator<New_Error, New_Expected>(
                    ($) => transform_the_error(transform_error($)),
                    cee
                )
            },

            //methods inherited from Safe_Iterator
            consume: (
                assign,
                no_item,
            ) => {
                const this_list_raw = $$.list.__get_raw()
                const currentx = look_raw()
                if (currentx === null) {
                    return no_item()
                }
                if (position > this_list_raw.length - 1) {
                    throw new Error("just checked that position is in bounds")
                }
                position += 1
                return assign(this_list_raw[position - 1]) // position was already incremented, so we need to return the previous item
            },
            discard: <T>(
                assign: () => T
            ) => {
                position += 1
                return assign()
            },
            list: <List_Item extends p_di.Value>($x: {
                has_more_items: ($: Item) => boolean,
                handle: ($: Item) => List_Item,
            }): p_di.List<List_Item> => {
                const raw: List_Item[] = []

                while (true) {
                    const next_element = look_raw()
                    if (next_element === null) {
                        break
                    } else if (!$x.has_more_items(next_element[0])) {
                        break
                    } else {
                        raw.push($x.handle(next_element[0]))
                    }
                }
                return lit.list(raw)
            },
            look: (item, no_item) => {
                const next = look_raw()
                if (next === null) {
                    return no_item($$.end_info)
                }
                return item(next[0])
            },
            look_raw: () => {
                if (position < 0 || position >= raw.length) {
                    return null
                }
                return [raw[position]]
            },
            look_ahead_raw: (offset: number) => {
                if (position + offset < 0 || position + offset >= raw.length) {
                    return null
                }
                return [raw[position + offset]]
            },
            optional: (
                $i,
            ) => {
                const next = look_raw()
                if (next === null) {
                    return lit.not_set()
                }
                return $i.item(
                    next[0],
                )

            },
            wrap_up: (callback, post) => {
                const result = callback()
                post()
                return result
            },
        }
    }

    const result = $$.assign(
        create_iterator<Error, Expected>(
            ($) => $,
            $$.create_expectation_error,
        )
    )
    if (position < length - 1) {
        $$.create_dangling_item_error(raw[position]).__extract_data(
            ($) => {
                $$.abort($)
            },
            () => {
                // do nothing
            }
        )
    }
    return result
}