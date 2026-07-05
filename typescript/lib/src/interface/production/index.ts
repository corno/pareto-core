import { type Iterator } from "./__internal/Iterator.js"
import { type Abort } from "../__internal/Abort.js"
import * as p_di from "../data/index.js"

export { type Iterator } from "./__internal/Iterator.js"

export type Production<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Iterator_Item extends p_di.Value,
    End_Info extends p_di.Value
> = (
    iterator: Iterator<
        Iterator_Item,
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
