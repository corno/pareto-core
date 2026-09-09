import { type Abort } from "./__internal/Abort.js"
import { type Raw_Optional_Value } from "./__internal/Raw_Optional_Value.js"
import { type Iterator } from "./interface/__internal/refiner/Iterator.js"
import * as p_di from "./schema.js"

export type Deserializer<
    Result extends p_di.Value,
    Error extends p_di.Value,
> = (
    $: string,
    abort: Abort<Error>,
) => Result

export type Deserializer_With_Parameter<
    Result extends p_di.Value,
    Error extends p_di.Value,
    Parameter extends p_di.Value
> = (
    $: string,
    abort: Abort<Error>,
    $p: Parameter,
) => Result

export type Deserializer_Without_Error<
    Result extends p_di.Value
> = (
    $: string,
) => Result

export type Deserializer_Without_Error_With_Parameter<
    Result extends p_di.Value,
    Parameter extends p_di.Value
> = (
    $: string,
    $p: Parameter,
) => Result
