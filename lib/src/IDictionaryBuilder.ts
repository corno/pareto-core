import { IReadonlyDictionary } from "pareto-lang-api"

export type IDictionaryBuilder<T> = {
    readonly "add": (key: string, value: T) => void
    readonly "toDictionary": () => IReadonlyDictionary<T>
}