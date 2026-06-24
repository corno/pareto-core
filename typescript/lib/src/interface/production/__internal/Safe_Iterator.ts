import * as p_di from "../../data"
import { Abort } from "../../__internal/Abort"
import { Raw_Optional_Value } from "../../__internal/Raw_Optional_Value"

export interface Safe_Iterator<
    Item extends p_di.Value,
    End_Info extends p_di.Value
> {
    consume: <T extends p_di.Value>(
        callback: (token: Item) => T,
        no_item: () => T,
    ) => T
    discard: <T extends p_di.Value>(callback: () => T) => T
    list: <List_Item extends p_di.Value>($: {
        has_more_items: ($: Item) => boolean,
        handle: ($: Item) => List_Item,
    }) => p_di.List<List_Item>,
    look: <T extends p_di.Value>(
        item: (token: Item) => T,
        no_item: (end_info: End_Info) => T,
    ) => T
    look_raw: () => Raw_Optional_Value<Item>,
    look_ahead_raw: (offset: number) => Raw_Optional_Value<Item>
    optional: <T extends p_di.Value>($: {
        item: (token: Item) => p_di.Optional_Value<T>,
    }) => p_di.Optional_Value<T>
    wrap_up: <T extends p_di.Value>(
        callback: () => T,
        post: () => any,
    ) => T
}