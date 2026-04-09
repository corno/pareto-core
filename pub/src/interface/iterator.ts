import { Raw_Optional_Value } from "./Raw_Optional_Value"
import { List } from "./data/List"
import { Optional_Value } from "./data/Optional_Value"
import { Abort } from "./abort"

export type Iterator<Item, End_Info> = {
    assert_finished: <T>(
        assign: () => T,
        abort: {
            not_finished: Abort<null>
        }
    ) => T
    consume: <T>(
        callback: (token: Item) => T,
        no_item: () => T,
    ) => T
    discard: <T>(callback: () => T) => void
    expect: <T, Error>($: {
        abort: Abort<Error>,
        get_error: ($: Optional_Value<Item>) => Error,
        item: (token: Item, abort: () => never) => T,
    }) => T
    get_end_info: () => End_Info
    list: <List_Item>($: {
        has_more_items: ($: Item) => boolean,
        handle: ($: Item) => List_Item,
    }) => List<List_Item>,
    look: <T>(
        item: (token: Item) => T,
        no_item: (end_info: End_Info) => T,
    ) => T
    look_raw: () => Raw_Optional_Value<Item>,
    look_ahead_raw: (offset: number) => Raw_Optional_Value<Item>
    optional: <T>($: {
        item: (token: Item) => Optional_Value<T>,
    }) => Optional_Value<T>
    wrap_up: <T>(
        callback: () => T,
        post: () => any,
    ) => T
}