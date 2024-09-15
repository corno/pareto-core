
/**
 * A lookup is similar to a Dictionary, but much more basic.
 * There are only operations to retrieve entries
 */
export interface Lookup<T> {
    __unsafeGetEntry(key: string): T
    __getEntry<RT>(key: string, exists: ($: T) => RT, nonExists: () => RT): RT
}