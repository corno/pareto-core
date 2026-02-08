import { Abort } from "../specials"


export type Refiner_With_Parameter<Result, Error, Input, Parameter> = (
    $: Input,
    abort: Abort<Error>,
    $p: Parameter,
) => Result


export type Refiner<Result, Error, Input> = (
    $: Input,
    abort: Abort<Error>,
) => Result

export type Refiner_Without_Error<Result, Input> = (
    $: Input,
) => Result

export type Refiner_Without_Error_With_Parameter<Result, Input, Parameter> = (
    $: Input,
    $p: Parameter,
) => Result