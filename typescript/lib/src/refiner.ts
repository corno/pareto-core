
export * from "./__internal/sync/data_switch.js"
export * as convert from "./__internal/refiner/convert.js"
export * as from from "./__internal/refiner/convert.js"
export * as literal from "./__internal/sync/initialize.js"
export * as initialize from "./__internal/sync/initialize.js"

export * from "./interface/refiner.js"


export function change_context<T, R>(
    $: T,
    callback: (context: T) => R,
): R {
    return callback($)
}