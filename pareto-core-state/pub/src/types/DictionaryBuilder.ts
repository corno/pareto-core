import { Dictionary } from "pareto-core-types"

/**
 * this type allows to build a dictionary in a statefull way (store the builder and over time add elements)
 * you can add (add()) elements to an array in the background and when all the elements are pushed,
 * a non mutable array can be retrieved (getDictionary())
 */
export type DictionaryBuilder<T> = {
    readonly "add": (key: string, value: T) => void
    readonly "getDictionary": () => Dictionary<T>
}