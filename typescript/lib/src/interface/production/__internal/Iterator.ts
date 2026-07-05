import * as p_di from "../../data"
import { type Abort } from "../../__internal/Abort"

export interface Iterator<
    Item extends p_di.Value,
    End_Info extends p_di.Value,
> {

    build_list: <List_Item extends p_di.Value>($: {
        has_more_items: ($: Item) => boolean,
        handle: () => List_Item,
        on_no_progression: Abort<null>,
    }) => p_di.List<List_Item>,
    build_list_with_segments: <List_Item extends p_di.Value>($: {
        has_more_items: ($: Item) => boolean,
        handle: () => p_di.List<List_Item>,
        on_no_progression: Abort<null>,
    }) => p_di.List<List_Item>,

    consume: <T extends p_di.Value>(
        no_item: (end_info: End_Info) => T,
        item: (token: Item) => T,
    ) => T
    consume_with_expectation: <
        Value extends p_di.Value,
        Expected extends p_di.Value
    >(
        expected: Expected,
        no_item: (end_info: End_Info, expected: Expected) => Value,
        item: (token: Item, expected: Expected) => Value,
    ) => Value
    peek: <T extends p_di.Value>(
        no_item: (end_info: End_Info) => T,
        item: (token: Item) => T,
    ) => T
    peek_ahead: <T extends p_di.Value>(
        offset: number,
        no_item: (end_info: End_Info) => T,
        item: (token: Item) => T,
    ) => T
    peek_with_expectation: <
        Value extends p_di.Value,
        Expected extends p_di.Value,
    >(
        expected: Expected,
        no_item: (end_info: End_Info, expected: Expected) => Value,
        item: (token: Item, expected: Expected) => Value,
    ) => Value
}