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
    on_dangling_item: null | Abort<Item>,
    create_expectation_error: Create_Expectation_Error<
        Error,
        Expected,
        Item,
        End_Info>,
    assign: (
        $iter: p_pi.Iterator<Item, End_Info, Error, Expected>,
        abort: Abort<Error>
    ) => Return_Type,
}): Return_Type {

    const raw = $$.list.__get_raw()

    let position = 0

    const look_raw = (ahead?: number): Raw_Optional_Value<Item> => {
        const pos = position + (ahead ?? 0)
        if (pos < 0 || pos >= raw.length) {
            return null
        }
        return [raw[pos]]
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

            consume: {

                boolean: (
                    assign,
                    no_item,
                ) => {
                    const currentx = look_raw()
                    if (currentx === null) {
                        return no_item(
                            $$.end_info,
                            ($) => $$.abort(transform_the_error($))
                        )
                    }
                    position += 1
                    return assign(
                        currentx[0],
                        ($) => $$.abort(transform_the_error($))
                    )
                },

                list: (
                    assign,
                    no_item,
                ) => {
                    const currentx = look_raw()
                    if (currentx === null) {
                        return no_item(
                            $$.end_info,
                            ($) => $$.abort(transform_the_error($))
                        )
                    }
                    position += 1
                    return assign(
                        currentx[0],
                        ($) => $$.abort(transform_the_error($))
                    )
                },

                nothing: (
                    assign,
                    no_item,
                ) => {
                    const currentx = look_raw()
                    if (currentx === null) {
                        return no_item(
                            $$.end_info,
                            ($) => $$.abort(transform_the_error($))
                        )
                    }
                    position += 1
                    return assign(
                        currentx[0],
                        ($) => $$.abort(transform_the_error($))
                    )
                },

                number: (
                    assign,
                    no_item,
                ) => {
                    const currentx = look_raw()
                    if (currentx === null) {
                        return no_item(
                            $$.end_info,
                            ($) => $$.abort(transform_the_error($))
                        )
                    }
                    position += 1
                    return assign(
                        currentx[0],
                        ($) => $$.abort(transform_the_error($))
                    )
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

                state: (
                    assign,
                    no_item,
                ) => {
                    const currentx = look_raw()
                    if (currentx === null) {
                        return no_item(
                            $$.end_info,
                            ($) => $$.abort(transform_the_error($))
                        )
                    }
                    position += 1
                    return assign(
                        currentx[0],
                        ($) => $$.abort(transform_the_error($))
                    )
                },

                text: (
                    assign,
                    no_item,
                ) => {
                    const currentx = look_raw()
                    if (currentx === null) {
                        return no_item(
                            $$.end_info,
                            ($) => $$.abort(transform_the_error($))
                        )
                    }
                    position += 1
                    return assign(
                        currentx[0],
                        ($) => $$.abort(transform_the_error($))
                    )
                },

            },

            build_list: <List_Item extends p_di.Value>($x: {
                has_more_items: ($: Item) => boolean,
                handle: () => List_Item,
            }): p_di.List<List_Item> => {
                const raw: List_Item[] = []

                while (true) {
                    const next_element = look_raw()
                    if (next_element === null) {
                        break
                    } else if (!$x.has_more_items(next_element[0])) {
                        break
                    } else {
                        raw.push($x.handle())
                    }
                }
                return lit.list(raw)
            },

            build_list_with_segments: <List_Item extends p_di.Value>($x: {
                has_more_items: ($: Item) => boolean,
                handle: () => p_di.List<List_Item>,
            }): p_di.List<List_Item> => {
                const raw: List_Item[] = []

                while (true) {
                    const next_element = look_raw()
                    if (next_element === null) {
                        break
                    } else if (!$x.has_more_items(next_element[0])) {
                        break
                    } else {
                        raw.push(...$x.handle().__get_raw())
                    }
                }
                return lit.list(raw)
            },

            peek: (item, no_item) => {
                const next = look_raw()
                if (next === null) {
                    return no_item($$.end_info, ($) => $$.abort(transform_the_error($)))
                }
                return item(next[0], ($) => $$.abort(transform_the_error($)))
            },

            peek_ahead: (offset, item, no_item) => {
                const next = look_raw(offset)
                if (next === null) {
                    return no_item($$.end_info, ($) => $$.abort(transform_the_error($)))
                }
                return item(next[0], ($) => $$.abort(transform_the_error($)))
            },

            state_based_on_strategy: (
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
        }
    }

    const result = $$.assign(
        create_iterator<Error, Expected>(
            ($) => $,
            $$.create_expectation_error,
        ),
        ($) => $$.abort($)
    )
    if ($$.on_dangling_item !== null) {
        if (position < raw.length - 1) {
            $$.on_dangling_item(raw[position])
        }
    }
    return result
}