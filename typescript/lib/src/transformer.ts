export * from "./__internal/sync/data_switch.js"

export * as from from "./__internal/transformer/from.js"

export * as literal from "./__internal/sync/literal.js"

export * from "./interface/transformer.js"



export function change_context<T, R>(
    $: T,
    callback: (context: T) => R,
): R {
    return callback($)
}