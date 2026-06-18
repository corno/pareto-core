import { Abort } from "../__internal/Abort"
import { Iterator } from "./Iterator"
import * as p_di from "../data"

export { Iterator } from "./Iterator"

export type Production<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value
> = (
    iterator: Iterator<Iterator_Item,
        End_Info
    >,

    abort: Abort<Error>,

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
        End_Info
    >,

    abort: Abort<Error>,

    $p: Parameter,

) => Result

export type Production_Without_Error<
    Result extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value
> = (
    iterator: Iterator<
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
    iterator: Iterator<
        Iterator_Item,
        End_Info
    >,

    $p: Parameter,

) => Result
