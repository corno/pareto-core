import * as p_di from "../../data"
import { Abort } from "../../__internal/Abort"
import { Safe_Iterator } from "./Safe_Iterator"

export interface Iterator<
    Item extends p_di.Value,
    End_Info extends p_di.Value,
    Error extends p_di.Value
> extends Safe_Iterator<Item, End_Info> {
    abort: Abort<Error>
    expect: <
        T extends p_di.Value,
    >($: {
        get_error: (
            $: p_di.Optional_Value<Item>,
            end_info: End_Info,
        ) => Error,
        item: (token: Item, abort: Abort<null>) => T,
    }) => T
    to_new_iterator: <New_Error extends p_di.Value>(
        transform_error: ($: New_Error) => Error
    ) => Iterator<Item, End_Info, New_Error>
}