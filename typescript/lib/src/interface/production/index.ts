import { Iterator } from "./__internal/Iterator"
import { Guaranteed_Value_Iterator } from "./__internal/Guaranteed_Value_Iterator"
import * as p_di from "../data"

export { Iterator } from "./__internal/Iterator"
export { Guaranteed_Value_Iterator as Safe_Iterator } from "./__internal/Guaranteed_Value_Iterator"

export type Production<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Expected extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value
> = (
    iterator: Iterator<
        Iterator_Item,
        End_Info,
        Error,
        Expected
    >,
) => Result

export type Production_With_Parameter<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Expected extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value,
    Parameter extends p_di.Value
> = (
    iterator: Iterator<
        Iterator_Item,
        End_Info,
        Error,
        Expected
    >,
    $p: Parameter,

) => Result

export type Production_Without_Error<
    Result extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value
> = (
    iterator: Guaranteed_Value_Iterator<
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
    iterator: Guaranteed_Value_Iterator<
        Iterator_Item,
        End_Info
    >,

    $p: Parameter,

) => Result
