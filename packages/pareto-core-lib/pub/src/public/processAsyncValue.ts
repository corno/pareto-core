import * as pt from 'pareto-core-types'

/**
 * @deprecated
 * @param $ 
 * @param $i 
 */
export function processAsyncValue<T>($: pt.AsyncValue<T>, $i: ($: T) => void): void {
   $.__execute($i)
}
