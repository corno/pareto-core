import * as p_di from "../../../interface/data.js"
import * as lit from "../../__internal/sync/literal.js"
import { type Abort } from "../../../interface/__internal/Abort.js"
import { type Iterator } from "../../../interface/__internal/refiner/Iterator.js"
import { type Raw_Optional_Value } from "../../../interface/__internal/Raw_Optional_Value.js"


export default function <
    Return_Type extends p_di.Value,
    Item extends p_di.Value,
    End_Info extends p_di.Value,
>($$: {
    list: p_di.List<Item>,
    end_info: End_Info,
    on_dangling_item: null | Abort<Item>,
    assign: (
        $iter: Iterator<Item, End_Info>,
    ) => Return_Type,
}): Return_Type {

    const raw = $$.list.__get_raw()

    let position = 0

    const look_raw = (ahead?: number): Raw_Optional_Value<Item> => {
        const pos = position + (ahead ?? 0)
        if (pos < 0 || pos >= raw.length) {
            return null
        }
        return [raw[pos]!]
    }

    const create_iterator = (
    ): Iterator<
        Item,
        End_Info
    > => {
        return {

            build_list: <List_Item extends p_di.Value>($x: {
                has_more_items: ($: Item) => boolean,
                handle: () => List_Item,
                on_no_progression: Abort<null>,
            }): p_di.List<List_Item> => {
                const raw: List_Item[] = []

                while (true) {
                    const next_element = look_raw()
                    if (next_element === null) {
                        break
                    } else if (!$x.has_more_items(next_element[0])) {
                        break
                    } else {
                        const position_before = position
                        const result = $x.handle()
                        if (position === position_before) {
                            return $x.on_no_progression(null)
                        }
                        raw.push(result)
                    }
                }
                return lit.list(raw)
            },

            build_list_with_segments: <List_Item extends p_di.Value>($x: {
                has_more_items: ($: Item) => boolean,
                handle: () => p_di.List<List_Item>,
                on_no_progression: Abort<null>,
            }): p_di.List<List_Item> => {
                const raw: List_Item[] = []

                while (true) {
                    const next_element = look_raw()
                    if (next_element === null) {
                        break
                    } else if (!$x.has_more_items(next_element[0])) {
                        break
                    } else {
                        const position_before = position
                        const result = $x.handle()
                        if (position === position_before) {
                            return $x.on_no_progression(null)
                        }
                        raw.push(...result.__get_raw())
                    }
                }
                return lit.list(raw)
            },

            consume: (
                no_item,
                item,
            ) => {
                const currentx = look_raw()
                if (currentx === null) {
                    return no_item(
                        $$.end_info,
                    )
                }
                position += 1
                return item(
                    currentx[0],
                )
            },

            consume_with_expectation: (
                expected,
                no_item,
                item,
            ) => {
                const currentx = look_raw()
                if (currentx === null) {
                    return no_item(
                        $$.end_info,
                        expected,
                    )
                }
                position += 1
                return item(
                    currentx[0],
                    expected,
                )
            },

            peek: (
                no_item,
                item,
            ) => {
                const next = look_raw()
                if (next === null) {
                    return no_item(
                        $$.end_info,
                    )
                }
                return item(
                    next[0],
                )
            },

            peek_ahead: (
                offset,
                no_item,
                item,
            ) => {
                const next = look_raw(offset)
                if (next === null) {
                    return no_item(
                        $$.end_info
                    )
                }
                return item(
                    next[0],
                )
            },

            peek_with_expectation: (
                expected,
                no_item,
                item,
            ) => {
                const next = look_raw()
                if (next === null) {
                    return no_item(
                        $$.end_info,
                        expected
                    )
                }
                return item(
                    next[0],
                    expected
                )
            },

        }
    }

    const result = $$.assign(
        create_iterator(),
    )
    if ($$.on_dangling_item !== null) {
        if (position < raw.length) {
            $$.on_dangling_item(raw[position]!)
        }
    }
    return result
}