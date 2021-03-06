import { IReadonlyDictionary } from "pareto-api-core"

export type IDictionaryBuilder<T> = {
    readonly "add": (key: string, value: T) => void
    readonly "toDictionary": () => IReadonlyDictionary<T>
}