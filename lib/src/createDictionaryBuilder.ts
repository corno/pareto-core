import { IReadonlyDictionary } from "pareto-api-core"
import { createDictionary } from "./createDictionary"
import { IDictionaryBuilder } from "./IDictionaryBuilder"

export function createDictionaryBuilder<T>(): IDictionaryBuilder<T> {
    const imp: { [key: string]: T } = {}
    return {
        add: (key: string, value: T) => {
            imp[key] = value
        },
        toDictionary: () => {
            return createDictionary(imp)
        },
    }
}