import * as pt from "pareto-core-types"
import * as pi from "pareto-core-internals"

import { AsyncValue } from "pareto-core-types"

/**
 * converts a regular value in a {@link AsyncValue}
 * @param $ the value
 * @returns 
 */
export function asyncValue<T>(
    $: T
): pt.AsyncValue<T> {
    return pi.wrapAsyncValueImp(
        ($c) => {
            $c($)
        }
    )
}