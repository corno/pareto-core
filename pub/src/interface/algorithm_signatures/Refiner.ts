import { Abort } from "../interfaces"


export type Refiner_With_Parameters<Result, Error, Input, Parameters> = (
    $: Input,
    abort: Abort<Error>,
    $p: Parameters,
) => Result


export type Refiner<Result, Error, Input> = (
    $: Input,
    abort: Abort<Error>,
) => Result

export type Refiner_Without_Error<Result, Input> = (
    $: Input,
) => Result

export type Refiner_Without_Error_With_Parameters<Result, Input, Parameters> = (
    $: Input,
    $p: Parameters,
) => Result