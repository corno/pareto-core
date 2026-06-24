import * as p_di from "../../data"
import { Abort } from "../../__internal/Abort"
import { Safe_Iterator } from "./Safe_Iterator"



export type Create_Expect_Error<
    Item extends p_di.Value,
    End_Info extends p_di.Value,
    Error extends p_di.Value,
    Expected_Item extends p_di.Value
> = (
    $: p_di.Optional_Value<Item>,
    expected: p_di.List<Expected_Item>,
    end_info: End_Info,
) => Error

export interface Iterator<
    Item extends p_di.Value,
    End_Info extends p_di.Value,
    Error extends p_di.Value,
    Expected_Item extends p_di.Value
> extends Safe_Iterator<Item, End_Info> {
    abort: Abort<Error>
    expect: <
        T extends p_di.Value,
    >($: {
        expected: p_di.List<Expected_Item>,
        item: (token: Item) => p_di.Optional_Value<T>,
    }) => T
    to_new_iterator: <
        New_Error extends p_di.Value,
        New_Expected_Item extends p_di.Value
    >(
        transform_error: ($: New_Error) => Error,
        create_expect_error: Create_Expect_Error<Item, End_Info, New_Error, New_Expected_Item>,
    ) => Iterator<Item, End_Info, New_Error, New_Expected_Item>
}