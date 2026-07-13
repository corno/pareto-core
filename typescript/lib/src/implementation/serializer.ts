import { type Value } from "../interface/__internal/schema/Value.js"

export * from "./__internal/sync/data_switch.js"

export * as from from "./__internal/transformer/from.js"

export * as literal from "./__internal/sync/literal.js"

export type List_Of_Characters = {
    readonly raw: number[]
}

export type Serializer<
    Input extends Value,
> = (
    $: Input,
) => List_Of_Characters

export type Serializer_With_Parameter<
    Input extends Value,
    Parameter extends Value,
> = (
    $: Input,
    $p: Parameter,
) => List_Of_Characters


export const text_from_list_of_characters = ($: List_Of_Characters): string => {
    let out = ""
    const chunkSize = 100000;
    for (let i = 0; i < $.raw.length; i += chunkSize) {
        const chunk = $.raw.slice(i, i + chunkSize);
        out += String.fromCharCode(...chunk);
    }
    return out
}