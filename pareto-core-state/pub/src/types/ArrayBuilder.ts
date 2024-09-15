import * as pt from "pareto-core-types"

/**
 * this type allows to build an array in a statefull way (store the builder and over time add elements)
 * you can add (push()) elements to an array in the background and when all the elements are pushed,
 * a non mutable array can be retrieved (getArray())
 */
export type ArrayBuilder<T> = {
    readonly "push": (value: T) => void
    readonly "getArray": () => pt.Array<T>
}