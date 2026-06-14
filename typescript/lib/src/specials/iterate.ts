import * as p_id from "../data/interface"
import * as p_i from "../interface"
import * as p_pi from "../production/interface"
import * as _p from "../assign"
import _p_list_build_deprecated from "./list_build_deprecated"
import _p_unreachable_code_path from "./unreachable_code_path"

export default function iterate<
    Item extends p_id.Value,
    End_Info extends p_id.Value,
    Return_Type extends p_id.Value
>(
    $: p_id.List<Item>,
    end_info: End_Info,
    assign: ($iter: p_pi.Iterator<Item, End_Info>) => Return_Type,
): Return_Type {

    const raw = $.__get_raw_copy()

    const length = raw.length

    let position = 0

    const look_raw = (): p_id.Raw_Optional_Value<Item> => {
        if (position < 0 || position >= raw.length) {
            return null
        }
        return [raw[position]]
    }

    return assign({
        assert_finished: (
            assign,
            abort
        ) => {
            const result = assign()
            if (position < length) {
                return abort.not_finished(null)
            }
            return result
        },
        consume: (
            assign,
            no_item,
        ) => {
            const currentx = look_raw()
            if (currentx === null) {
                return no_item()
            }
            const current = $.__deprecated_get_item_at(
                position,
                {
                    out_of_bounds: () => _p_unreachable_code_path("just checked that position is in bounds"),
                }
            )
            position += 1
            return assign(current)
        },
        discard: <T>(
            assign: () => T
        ) => {
            position += 1
            return assign()
        },
        expect: (
            $i,
        ) => {
            const next = look_raw()
            if (next === null) {
                return $i.abort($i.get_error(_p.optional.literal.not_set()))
            }
            return $i.item(
                next[0],
                () => $i.abort(
                    $i.get_error(_p.optional.literal.set(next[0])),
                )
            )
        },
        get_end_info: () => end_info,
        // discard_after: <T>(
        //     assign: () => T
        // ) => {
        //     const value = assign()
        //     position += 1
        //     return value
        // },
        // get_position: () => {
        //     return position
        // },
        list: <List_Item extends p_id.Value>($x: {
            has_more_items: ($: Item) => boolean,
            handle: ($: Item) => List_Item,
        }): p_id.List<List_Item> => {
            return _p_list_build_deprecated<List_Item>(($i) => {
                while (true) {
                    const next_element = look_raw()
                    if (next_element === null) {
                        return
                    } else if (!$x.has_more_items(next_element[0])) {
                        return
                    } else {
                        $i['add item']($x.handle(next_element[0]))
                    }
                }
            })
        },
        look: (item, no_item) => {
            const next = look_raw()
            if (next === null) {
                return no_item(end_info)
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
                return _p.optional.literal.not_set()
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
}