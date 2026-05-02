import * as _pi from "./interface"
import * as _p from "./assign"
import { Raw_Optional_Value } from "./interface/Raw_Optional_Value"
import _p_list_build_deprecated from "./_p_list_build_deprecated"
import _p_unreachable_code_path from "./_p_unreachable_code_path"

export default function _p_iterate<Item, End_Info, Return_Type>(
    $: _pi.List<Item>,
    end_info: End_Info,
    assign: ($iter: _pi.Iterator<Item, End_Info>) => Return_Type,
): Return_Type {

    const raw = $.__get_raw_copy()

    const length = raw.length

    let position = 0

    const look_raw = (): Raw_Optional_Value<Item> => {
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
        list: <List_Item>($x: {
            has_more_items: ($: Item) => boolean,
            handle: ($: Item) => List_Item,
        }): _pi.List<List_Item> => {
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