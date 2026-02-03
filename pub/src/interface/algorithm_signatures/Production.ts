import { Abort } from "../specials"
import { Iterator } from "../specials"

export type Production<Result, Error, Iterator_Item> = (
    iterator: Iterator<Iterator_Item>,
    abort: Abort<Error>,
) => Result

export type Production_With_Parameters<Result, Error, Iterator_Item, Parameters> = (
    iterator: Iterator<Iterator_Item>,
    abort: Abort<Error>,
    $p: Parameters,
) => Result

export type Production_Without_Error<Result, Iterator_Item> = (
    iterator: Iterator<Iterator_Item>,
) => Result

export type Production_Without_Error_With_Parameters<Result, Iterator_Item, Parameters> = (
    iterator: Iterator<Iterator_Item>,
    $p: Parameters,
) => Result
