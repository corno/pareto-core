import { Abort } from "../specials"
import { Iterator } from "../specials"

export type Production<Result, Error, Iterator_Item> = (
    iterator: Iterator<Iterator_Item>,
    abort: Abort<Error>,
) => Result

export type Production_With_Parameter<Result, Error, Iterator_Item, Parameter> = (
    iterator: Iterator<Iterator_Item>,
    abort: Abort<Error>,
    $p: Parameter,
) => Result

export type Production_Without_Error<Result, Iterator_Item> = (
    iterator: Iterator<Iterator_Item>,
) => Result

export type Production_Without_Error_With_Parameter<Result, Iterator_Item, Parameter> = (
    iterator: Iterator<Iterator_Item>,
    $p: Parameter,
) => Result
