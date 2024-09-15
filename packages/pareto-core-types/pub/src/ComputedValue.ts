/**
 * A computed value is a function without paramters returning the specified type
 * it makes it possible to do the evaluation only when the function is called
 * useful for lazy evaluation or when side effects are needed
 */
export type ComputedValue<T> = () => T