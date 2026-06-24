import * as p_di from "../../data"
import { Abort } from "../../__internal/Abort"
import { Guaranteed_Value_Iterator } from "./Guaranteed_Value_Iterator"



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
> extends Guaranteed_Value_Iterator<Item, End_Info> {
    abort: Abort<Error>
    expect: <
        T extends p_di.Value,
    >($: {
        expected: Expected,
        discard: boolean,
        item: (token: Item, abort: Abort<null>) => T,
    }) => T
    unguaranteed_optional_value: <
        T extends p_di.Value,
    >($: {
        expected: Expected,
        discard: boolean,
        item: (token: Item, abort: Abort<null>) => p_di.Optional_Value<T>,
    }) => p_di.Optional_Value<T>
    unguaranteed_state: <
        State extends p_di.State,
    >($: {
        expected: Expected,
        discard: boolean,
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