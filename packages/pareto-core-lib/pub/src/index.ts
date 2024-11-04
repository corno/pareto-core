import { wrapRawOptionalValue } from 'pareto-core-internals'
import * as pt from 'pareto-core-types'


export * from "./public/processAsyncValue"

/**
 * these functions coming from core-internals should be exposed for library development
 */
export { set, notSet, cc, au, ss, panic } from "pareto-core-internals"


/**
 * @deprecated
 */
export function optional<T, RT>(
    $: pt.RawOptionalValue<T>,
    set: ($: T) => RT,
    notSet: () => RT,
): RT {
    return wrapRawOptionalValue($).map(set, notSet)
}