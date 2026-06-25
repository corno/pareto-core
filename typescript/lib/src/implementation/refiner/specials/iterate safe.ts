import * as p_di from "../../../interface/data"
import * as p_pi from "../../../interface/production"
import * as lit from "../../__internal/sync/literal"
import { Abort } from "../../../interface/__internal/Abort"

import { Raw_Optional_Value } from "../../../interface/__internal/Raw_Optional_Value"

export default function iterate_safe<
    Return_Type extends p_di.Value,
    Item extends p_di.Value,
    End_Info extends p_di.Value,
>(
    list: p_di.List<Item>,
    end_info: End_Info,
    assign: ($iter: p_pi.Safe_Iterator<Item, End_Info>) => Return_Type,
): Return_Type {

    const raw = list.__get_raw()

    let position = 0

    const look_raw = (ahead?: number): Raw_Optional_Value<Item> => {
        const pos = position + (ahead ?? 0)
        if (pos < 0 || pos >= raw.length) {
            return null
        }
        return [raw[pos]]
    }

    const result = assign({

        consume: {

            boolean: (
                assign,
                no_item,
            ) => {
                const currentx = look_raw()
                if (currentx === null) {
                    return no_item(
                        end_info,
                    )
                }
                position += 1
                return assign(
                    currentx[0],
                )
            },

            nothing: (
                assign,
                no_item,
            ) => {
                const currentx = look_raw()
                if (currentx === null) {
                    return no_item(
                        end_info,
                    )
                }
                position += 1
                return assign(
                    currentx[0],
                )
            },

            number: (
                assign,
                no_item,
            ) => {
                const currentx = look_raw()
                if (currentx === null) {
                    return no_item(
                        end_info,
                    )
                }
                position += 1
                return assign(
                    currentx[0],
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

            text: (
                assign,
                no_item,
            ) => {
                const currentx = look_raw()
                if (currentx === null) {
                    return no_item(
                        end_info,
                    )
                }
                position += 1
                return assign(
                    currentx[0],
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

        peek: (
            assign,
            no_item,
        ) => {
            const this_list_raw = list.__get_raw()
            const currentx = look_raw()
            if (currentx === null) {
                return no_item(end_info)
            }
            if (position > this_list_raw.length - 1) {
                throw new Error("just checked that position is in bounds")
            }
            return assign(this_list_raw[position])
        },

        peek_ahead: (
            offset,
            assign,
            no_item,
        ) => {
            const this_list_raw = list.__get_raw()
            const currentx = look_raw(offset)
            if (currentx === null) {
                return no_item(end_info)
            }
            if (position > this_list_raw.length - 1) {
                throw new Error("just checked that position is in bounds")
            }
            return assign(this_list_raw[position])
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

    })
    return result
}