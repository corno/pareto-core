import { type Value } from "../interface/__internal/schema/Value.js"
import { type List } from "../interface/__internal/schema/List.js"

export * from "./__internal/sync/data_switch.js"

export * as from from "./__internal/transformer/from.js"

export * as literal from "./__internal/sync/literal.js"
import { type Phrase } from "../temp/fountain_pen/phrase.js"
import * as data_switch from "./__internal/sync/data_switch.js"

import p_text_from_list from "./transformer/specials/text_from_list.js"

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
        case 'composed': return $[1].map(($) => text_from_phrase($)).join("")
        case 'nothing': return ""
        default: return data_switch.exhaustive($[0])
    }
}
export namespace ph {
    export const composed = (
        phrases: Phrase[]
    ): Phrase => ['composed', phrases]

    export const literal = (
        value: string
    ): Phrase => ['value', value]

    export const list_of_characters = (
        list: List<number>
    ): Phrase => ['value', p_text_from_list(
        list,
        ($) => $,
    )]
}