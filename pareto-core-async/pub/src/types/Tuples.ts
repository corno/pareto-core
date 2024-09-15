
//I don't know of a way to define a type with an arbitrary number of parametrized types,
//so I create 2 types; 1 for 2 elements and 1 for 3 elements

/**
 * An object that has 2 elements ('first' and 'second')
 * 
 */
export type AsyncTuple2Result<T1, T2> = { first: T1, second: T2 }

/**
 * An object that has 3 elements ('first', 'second' and 'third')
 * 
 */
export type AsyncTuple3Result<T1, T2, T3> = { first: T1, second: T2, third: T3 }
