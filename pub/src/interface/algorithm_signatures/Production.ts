import { Abort } from "../abort"
import { Iterator } from "../iterator"

export type Production<Result, Error, Iterator_Item, End_Info> = (
    iterator: Iterator<Iterator_Item, End_Info>,
    abort: Abort<Error>,
) => Result

export type Production_With_Parameter<Result, Error, Iterator_Item, Parameter, End_Info> = (
    iterator: Iterator<Iterator_Item, End_Info>,
    abort: Abort<Error>,
    $p: Parameter,
) => Result

export type Production_Without_Error<Result, Iterator_Item, End_Info> = (
    iterator: Iterator<Iterator_Item, End_Info>,
) => Result

export type Production_Without_Error_With_Parameter<Result, Iterator_Item, Parameter, End_Info> = (
    iterator: Iterator<Iterator_Item, End_Info>,
    $p: Parameter,
) => Result
