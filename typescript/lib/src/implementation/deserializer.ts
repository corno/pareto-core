
export * from "./__internal/sync/data_switch.js"
export * as from from "./__internal/refiner/from.js"
export * as literal from "./__internal/sync/literal.js"
import { type Value } from "../interface/__internal/schema/Value.js"
import type { Abort } from "../interface/__internal/Abort.js"
import { type List_Of_Characters } from "./serializer.js"


export type Deserializer<
    Result extends Value,
    Error extends Value,
> = (
    $: List_Of_Characters,
    abort: Abort<Error>,
) => Result

export type Deserializer_With_Parameter<
    Result extends Value,
    Error extends Value,
    Parameter extends Value
> = (
    $: List_Of_Characters,
    abort: Abort<Error>,
    $p: Parameter,
) => Result

export type Deserializer_Without_Error<
    Result extends Value,
> = (
    $: List_Of_Characters,
) => Result

export type Deserializer_Without_Error_With_Parameter<
    Result extends Value,
    Parameter extends Value
> = (
    $: List_Of_Characters,
    $p: Parameter,
) => Result

import * as literal from "./__internal/sync/literal.js"

export const list_from_list_of_characters = <T extends Value>(
    list_of_characters: List_Of_Characters,
    assign_character: (character: number) => T,
): import("../interface/__internal/schema/List.js").List<T> => {
    const raw = list_of_characters.raw.map(($) => assign_character($))
    return literal.list(raw)
}