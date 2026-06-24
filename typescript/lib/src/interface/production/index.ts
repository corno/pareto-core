import { Iterator } from "./__internal/Iterator"
import { Safe_Iterator } from "./__internal/Safe_Iterator"
import * as p_di from "../data"

export { Iterator } from "./__internal/Iterator"
export { Safe_Iterator } from "./__internal/Safe_Iterator"

export type Production<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value
> = (
    iterator: Iterator<
        Iterator_Item,
        End_Info,
        Error
    >,
) => Result

export type Production_With_Parameter<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value,
    Parameter extends p_di.Value
> = (
    iterator: Iterator<
        Iterator_Item,
        End_Info,
        Error
    >,
    $p: Parameter,

) => Result

export type Production_Without_Error<
    Result extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value
> = (
    iterator: Safe_Iterator<
        Iterator_Item,
        End_Info
    >,

) => Result

export type Production_Without_Error_With_Parameter<
    Result extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value,
    Parameter extends p_di.Value
> = (
    iterator: Safe_Iterator<
        Iterator_Item,
        End_Info
    >,

    $p: Parameter,

) => Result
