import { type Value } from "../interface/__internal/schema/Value.js"

export * from "./__internal/sync/data_switch.js"

export * as from from "./__internal/transformer/from.js"

export * as literal from "./__internal/sync/literal.js"
import { type Phrase, type Paragraph } from "../temp/fountain_pen/prose.js"
import * as fp_serialize from "../temp/fountain_pen/serializers/prose.js"
import p_text_from_list from "../implementation/transformer/specials/text_from_list.js"

export type Phrase_Serializer<
    Input extends Value,
> = (
    $: Input,
) => Phrase

export type Phrase_Serializer_With_Parameter<
    Input extends Value,
    Parameter extends Value,
> = (
    $: Input,
    $p: Parameter,
) => Phrase

export type Paragraph_Serializer<
    Input extends Value,
> = (
    $: Input,
) => Paragraph

export type Paragraph_Serializer_With_Parameter<
    Input extends Value,
    Parameter extends Value,
> = (
    $: Input,
    $p: Parameter,
) => Paragraph


// export const text_from_list_of_characters = ($: List_Of_Characters): string => {
//     let out = ""
//     const chunkSize = 100000;
//     for (let i = 0; i < $.raw.length; i += chunkSize) {
//         const chunk = $.raw.slice(i, i + chunkSize);
//         out += String.fromCharCode(...chunk);
//     }
//     return out
// }

// export const list_of_characters_from_text = ($: string): List_Of_Characters => {
//     const raw: number[] = []
//     for (let i = 0; i < $.length; i++) {
//         raw.push($.charCodeAt(i))
//     }
//     return { raw }
// }

// export const list_of_characters_from_list = <T extends Value>(
//     list: import("../interface/__internal/schema/List.js").List<T>,
//     assign_character: (item: T) => number,
// ): List_Of_Characters => {
//     const raw = list.__get_raw().map(($) => assign_character($))
//     return { raw }
// }

export const text_from_phrase = ($: Phrase, indentation: string, newline: string): string => {
    return p_text_from_list(
        fp_serialize.Phrase(
            $,
            {
                'newline': newline,
                'indentation': indentation,
            }
        ),
        ($) => $
    )
}

export const text_from_paragraph = ($: Paragraph, indentation: string, newline: string): string => {
    return p_text_from_list(
        fp_serialize.Paragraph(
            $,
            {
                'newline': newline,
                'indentation': indentation,
            }
        ),
        ($) => $
    )
}