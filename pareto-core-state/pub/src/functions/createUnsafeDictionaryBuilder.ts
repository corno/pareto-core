import { panic } from "pareto-core-internals"
import { DictionaryBuilder } from "../types/DictionaryBuilder"
import { createDictionaryBuilder } from "./createDictionaryBuilder"

/**
 * creates a {@link DictionaryBuilder}.
 * if entries are added to the builder of which the key already exists, the code
 * will {@link panic}
 * @returns 
 */
export function createUnsafeDictionaryBuilder<T>(): DictionaryBuilder<T> {
    return createDictionaryBuilder(
        ["ignore", {}],
        (key) => {
            panic(`CORE: duplicate key: ${key}`)
        }
    )
}