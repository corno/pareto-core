import { type Value } from "../interface/__internal/schema/Value.js"

export * from "./__internal/sync/data_switch.js"

export * as from from "./__internal/transformer/from.js"

export * as literal from "./__internal/sync/literal.js"
import { type Phrase } from "../temp/fountain_pen/phrase.js"
import * as data_switch from "./__internal/sync/data_switch.js"

export type Phrase_Serializer<
    Input extends Value,
> = (
    $: Input,
) => string

export type Phrase_Serializer_With_Parameter<
    Input extends Value,
    Parameter extends Value,
> = (
    $: Input,
    $p: Parameter,
) => string


export const text_from_phrase = (
    $: Phrase
): string => {
    if (typeof $ === 'string') {
        return $ // return the string directly
    }

    switch ($[0]) {
        case 'value': return $[1] // return the string directly
        case 'composed': return $[1].__get_raw().map(($) => text_from_phrase($)).join("")
        case 'nothing': return ""
        default: return data_switch.exhaustive($[0])
    }
}