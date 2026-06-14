import { Abort } from "../Abort"
import { Iterator } from "../Iterator"
import { Value } from "../data/Value"

export type Production<
    Result extends Value,
    Error extends Value,
    Iterator_Item extends Value,
    End_Info extends Value> = (
        iterator: Iterator<Iterator_Item,
            End_Info>,

        abort: Abort<Error>,

    ) => Result

export type Production_With_Parameter<
    Result extends Value,
    Error extends Value,
    Iterator_Item extends Value,
    End_Info extends Value,
    Parameter extends Value> = (
        iterator: Iterator<Iterator_Item,
            End_Info>,

        abort: Abort<Error>,

        $p: Parameter,

    ) => Result

export type Production_Without_Error<
    Result extends Value,
    Iterator_Item extends Value,
    End_Info extends Value> = (
        iterator: Iterator<Iterator_Item,
            End_Info>,

    ) => Result

export type Production_Without_Error_With_Parameter<
    Result extends Value,
    Iterator_Item extends Value,
    End_Info extends Value,
    Parameter extends Value> = (
        iterator: Iterator<Iterator_Item,
            End_Info>,

        $p: Parameter,

    ) => Result
