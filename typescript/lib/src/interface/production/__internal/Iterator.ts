import * as p_di from "../../data"
import { Abort } from "../../__internal/Abort"


export type Create_Expectation_Error<
    Error extends p_di.Value,
    Expected extends p_di.Value,
    Item extends p_di.Value,
    End_Info extends p_di.Value,
> = (
    expected: Expected,
    found:
        | ['item', Item]
        | ['end', End_Info],
) => Error

export interface Iterator<
    Item extends p_di.Value,
    End_Info extends p_di.Value,
    Error extends p_di.Value,
    Expected extends p_di.Value
> {

    consume: {
        boolean: (
            callback: (token: Item, abort: Abort<Error>) => boolean,
            no_item: (end_info: End_Info, abort: Abort<Error>) => boolean,
        ) => boolean
        list: <T extends p_di.Value>(
            callback: (token: Item, abort: Abort<Error>) => p_di.List<T>,
            no_item: (end_info: End_Info, abort: Abort<Error>) => p_di.List<T>,
        ) => p_di.List<T>
        nothing: (
            callback: (token: Item, abort: Abort<Error>) => null,
            no_item: (end_info: End_Info, abort: Abort<Error>) => null,
        ) => null
        number: (
            callback: (token: Item, abort: Abort<Error>) => number,
            no_item: (end_info: End_Info, abort: Abort<Error>) => number,
        ) => number
        optional: <T extends p_di.Value>($: {
            item: (token: Item) => p_di.Optional_Value<T>,
        }) => p_di.Optional_Value<T>
        state: <State extends p_di.State>(
            callback: (token: Item, abort: Abort<Error>) => State,
            no_item: (end_info: End_Info, abort: Abort<Error>) => State,
        ) => State
        text: (
            callback: (token: Item, abort: Abort<Error>) => string,
            no_item: (end_info: End_Info, abort: Abort<Error>) => string,
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
        item: (token: Item, abort: Abort<Error>) => T,
        no_item: (end_info: End_Info, abort: Abort<Error>) => T,
    ) => T
    peek_ahead: <T extends p_di.Value>(
        offset: number,
        item: (token: Item, abort: Abort<Error>) => T,
        no_item: (end_info: End_Info, abort: Abort<Error>) => T,
    ) => T
    state_based_on_strategy: <
        State extends p_di.State,
    >($: {
        expected: Expected,
        item: (token: Item, abort: Abort<null>) => State,
    }) => State
    to_new_iterator: <
        New_Error extends p_di.Value,
        New_Expected extends p_di.Value
    >(
        transform_error: ($: New_Error) => Error,
        create_expectation_error: Create_Expectation_Error<
            New_Error,
            New_Expected,
            Item,
            End_Info
        >,
    ) => Iterator<Item, End_Info, New_Error, New_Expected>
}