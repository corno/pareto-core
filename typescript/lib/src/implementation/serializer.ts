import { type Value } from "../interface/__internal/schema/Value.js"

export * from "./__internal/sync/data_switch.js"

export * as from from "./__internal/transformer/from.js"

export * as literal from "./__internal/sync/literal.js"
import { type Phrase } from "../temp/fountain_pen/prose.js"

export type Serializer<
    Input extends Value,
> = (
    $: Input,
) => Phrase

export type Serializer_With_Parameter<
    Input extends Value,
    Parameter extends Value,
> = (
    $: Input,
    $p: Parameter,
) => Phrase


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