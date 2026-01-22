import { Abort } from "../interfaces"
import { Iterator } from "../interfaces"

export type Production<Result, Error, Iterator_Element> = (
    iterator: Iterator<Iterator_Element>,
    abort: Abort<Error>,
) => Result

export type Production_With_Parameters<Result, Error, Iterator_Element, Parameters> = (
    iterator: Iterator<Iterator_Element>,
    abort: Abort<Error>,
    $p: Parameters,
) => Result

export type Production_Without_Error<Result, Iterator_Element> = (
    iterator: Iterator<Iterator_Element>,
) => Result

export type Production_Without_Error_With_Parameters<Result, Iterator_Element, Parameters> = (
    iterator: Iterator<Iterator_Element>,
    $p: Parameters,
) => Result
