import * as pr from "pareto-core-internals"
import { ArrayBuilder } from "../types/ArrayBuilder"

/**
 * creates an {@link ArrayBuilder }.
 * 
 * @returns
 */
export function createArrayBuilder<T>(): ArrayBuilder<T> {
    const imp: T[] = []
    return {
        push: (value: T) => {
            imp.push(value)
        },
        getArray: () => {
            return pr.wrapRawArray(imp.slice(0))
        },
    }
}