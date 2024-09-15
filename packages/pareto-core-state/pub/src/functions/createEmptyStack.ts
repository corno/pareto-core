import * as pi from 'pareto-core-internals'

import { createStack } from "./createStack"

/**
 * documentation TBD
 * @returns 
 */
export function createEmptyStack<T>() {
    return createStack<T>(pi.wrapRawArray([]))
}