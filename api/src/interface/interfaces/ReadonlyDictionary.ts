import { IReadonlyLookup } from "./ReadonlyLookup"

export type TKeyValueTuple<T> = { key: string, value: T}

export type IReadonlyDictionary<T> = {
    //readonly "forEach": (callback: (entry: T, key: string) => void) => void
    readonly "getLookup": () => IReadonlyLookup<T>
    readonly "find": <RT>(
        key: string,
        ifFound: (entry: T) => RT,
        ifNotFound: (keys: string[]) => RT,
    ) => RT
    readonly "map": <NT>(cb: (v: T, key: string) => NT) => IReadonlyDictionary<NT>
    readonly "toArray": () => TKeyValueTuple<T>[]
}