import { Value } from "./Value";

/**
 * A circular dependency is a function without parameters returning the specified type
 * it makes it possible to do the evaluation only when the function is called
 * useful for lazy evaluation
 */
export interface Circular_Dependency<T extends Value> {
    get_circular_dependent: () => T
}