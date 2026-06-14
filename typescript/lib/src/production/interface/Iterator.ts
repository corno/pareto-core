import * as p_i from "../../interface"
import * as p_id from "../../data/interface"

export type Iterator<
    Item extends p_id.Value,
    End_Info extends p_id.Value
> = {
    assert_finished: <T>(
        assign: () => T,
        abort: {
            not_finished: p_i.Abort<null>
        }
    ) => T
    consume: <T>(
        callback: (token: Item) => T,
        no_item: () => T,
    ) => T
    discard: <T>(callback: () => T) => void
    expect: <T, Error>($: {
        abort: p_i.Abort<Error>,
        get_error: ($: p_id.Optional_Value<Item>) => Error,
        item: (token: Item, abort: p_i.Abort<null>) => T,
    }) => T
    get_end_info: () => End_Info
    list: <List_Item extends p_id.Value>($: {
        has_more_items: ($: Item) => boolean,
        handle: ($: Item) => List_Item,
    }) => p_id.List<List_Item>,
    look: <T>(
        item: (token: Item) => T,
        no_item: (end_info: End_Info) => T,
    ) => T
    look_raw: () => p_id.Raw_Optional_Value<Item>,
    look_ahead_raw: (offset: number) => p_id.Raw_Optional_Value<Item>
    optional: <T extends p_id.Value>($: {
        item: (token: Item) => p_id.Optional_Value<T>,
    }) => p_id.Optional_Value<T>
    wrap_up: <T>(
        callback: () => T,
        post: () => any,
    ) => T
}