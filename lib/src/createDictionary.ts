import { IReadonlyDictionary } from "pareto-api-core"

export function createDictionary<T>(source: { [key: string]: T }): IReadonlyDictionary<T> {

    return {
        map: <NT>(callback: (entry: T, key: string) => NT) => {
            const imp: { [key: string]: NT} = {}
            Object.keys(source).sort().forEach((key) => {
                imp[key] = callback(source[key], key)
            })
            return createDictionary(imp)
        },
        toArray: () => {
            return Object.keys(source).sort().map((key) => {
                return {
                    key: key,
                    value: source[key],
                }
            })
        },
        getLookup: () => {
            return {
                getUnsafe: (key: string): T => {
                    const entry = source[key]
                    if (entry === undefined) {
                        throw new Error(`no such entry: ${key}, options: ${Object.keys(source).join(", ")}`)
                    }
                    return entry
                },
                with: <RT>(
                    key: string,
                    ifFound: (v: T) => RT,
                    ifNotFound: (keys: string[]) => RT,
                ): RT => {
                    const entry = source[key]
                    if (entry === undefined) {
                        return ifNotFound(Object.keys(source).sort())
                    }
                    return ifFound(entry)
                },

            }
        },
        find: (
            key,
            ifFound,
            ifNotFound,
        ) => {
            const keys: string[] = []
            let entry: T | null = null
            Object.keys(source).forEach((k) => {
                keys.push(k)
                if (k === key) {
                    entry = source[k]
                }
            })
            if (entry === null) {
                return ifNotFound(keys)
            } else {
                return ifFound(entry)
            }
        },
    }
}
