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

    const look_raw = (): Raw_Optional_Value<Item> => {
        if (position < 0 || position >= raw.length) {
            return null
        }
        return [raw[position]]
    }

    const result = assign({
        text: (
            assign,
            no_item,
        ) => {
            const this_list_raw = list.__get_raw()
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
        number: (
            assign,
            no_item,
        ) => {
            const this_list_raw = list.__get_raw()
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
        consume: (
            assign,
            no_item,
        ) => {
            const this_list_raw = list.__get_raw()
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
        discard_non_value_item: <T>(
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
                return no_item(end_info)
            }
            return item(next[0])
        },
        deprecated_look_raw: () => {
            if (position < 0 || position >= raw.length) {
                return null
            }
            return [raw[position]]
        },
        deprecated_look_ahead_raw: (offset: number) => {
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
    })
    return result
}