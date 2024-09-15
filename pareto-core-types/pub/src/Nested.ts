
/**
 * this type allows to nest a set of data types
 * example: const A: Nested<number> = [ 1, [ 2, 3 ] ]
 * 
 * caution: the type T cannot be an array, because then it is not clear what an empty array would mean;
 * -a T value
 * -or a Nested<T>[]
 */
export type Nested<T> = T | Nested<T>[]