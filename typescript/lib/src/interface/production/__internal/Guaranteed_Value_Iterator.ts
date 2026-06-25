import * as p_di from "../../data"

export interface Guaranteed_Value_Iterator<
    Item extends p_di.Value,
    End_Info extends p_di.Value
> {

    consume: {
        boolean: (
            callback: (token: Item) => boolean,
            no_item: (end_info: End_Info) => boolean,
        ) => boolean
        nothing: (
            callback: (token: Item) => null,
            no_item: (end_info: End_Info) => null,
        ) => null
        number: (
            callback: (token: Item) => number,
            no_item: (end_info: End_Info) => number,
        ) => number
        optional: <T extends p_di.Value>($: {
            item: (token: Item) => p_di.Optional_Value<T>,
        }) => p_di.Optional_Value<T>
        text: (
            callback: (token: Item) => string,
            no_item: (end_info: End_Info) => string,
        ) => string
    }
    build_list: <List_Item extends p_di.Value>($: {
        has_more_items: ($: Item) => boolean,
        handle: () => List_Item,
    }) => p_di.List<List_Item>,
    build_list_with_segments: <List_Item extends p_di.Value>($: {
        has_more_items: ($: Item) => boolean,
        handle: () => p_di.List<List_Item>,
    }) => p_di.List<List_Item>,
    peek: <T extends p_di.Value>(
        item: (token: Item) => T,
        no_item: (end_info: End_Info) => T,
    ) => T
    peek_ahead: <T extends p_di.Value>(
        offset: number,
        item: (token: Item) => T,
        no_item: (end_info: End_Info) => T,
    ) => T
}