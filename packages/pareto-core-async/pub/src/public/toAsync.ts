import * as pt from "pareto-core-types"
import * as pi from "pareto-core-internals"

/**
 * @deprecated I don't think this function still serves a purpose
 * @param $c 
 * @returns 
 */
export function toAsyncValue<T>(
    $c: (
        $i: ($: T) => void
    ) => void
): pt.AsyncValue<T> {
    return pi.wrapAsyncValueImp(
        (cb) => {
            let hasBeenCalled = false
            $c(($) => {
                if (hasBeenCalled) {
                    throw new Error("callback has already been called")
                }
                hasBeenCalled = true
                cb($)
            })
        }
    )
}