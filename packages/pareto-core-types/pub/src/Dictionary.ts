import { AsyncValue } from "./AsyncValue"
import { OptionalValue } from "./OptionalValue"

/**
 * A Pareto dictionary.
 * unmutable and minimal by design
 */
export interface Dictionary<T> {
    /**
     * 
     * @param $v callback to transform an individual entry. keys are not available.
     */
    map<NT>(
        $v: ($: T) => NT
    ): Dictionary<NT>

    /**
     * 
     * @param $v callback that provides an {@link AsyncValue}. keys are not available.
     */
    asyncMap<NT>(
        $v: ($: T) => AsyncValue<NT>
    ): AsyncValue<Dictionary<NT>>


    /**
     * This method is only to be used by resources
     * the normal map function does not expose the key. This function does
     */
    __mapWithKey<NT>(
        $v: ($: T, key: string) => NT
    ): Dictionary<NT>

    /**
     * This method is only to be used by resources
     * iterates over all entries in a sorted manner
     * 
     * @param isFirstBeforeSecond a sorting callback that compares 2 entries.
     * @param $v callback to process the entry
     */
    __forEach(
        isFirstBeforeSecond: (first: string, second: string) => boolean,
        $v: ($: T, key: string) => void
    ): void

    /**
     * @deprecated replaced by __getEntryOrPanic
     * 
     * This method is only to be used by resources
     * gets an entry. If the entry does not exist, the code will panic and terminate.
     */
    __unsafeGetEntry(
        key: string,
    ): T

    /**
     * This method is only to be used by resources
     * gets an entry. If the entry does not exist, the code will panic and terminate.
     */
    __getEntryOrPanic(
        key: string,
    ): T

    /**
     * @deprecated replaced by __getOptionalEntry
     * 
     * This method is only to be used by resources
     * gets a (transformed) entry. Besides the key, 2 callbacks have to be provided. 
     * @param key 
     * @param exists callback that transforms the entry in the result type 
     * @param nonExists callback that provides the result value when the entry does not exist
     */
    __getEntry<RT>(
        key: string,
        exists: ($: T) => RT,
        nonExists: () => RT,
    ): RT

    /**
     * This method is only to be used by resources
     * returns an {@link OptionalValue } of type T reflecting wether the entry existed or not
     * 
     * @param key 
     */
    __getOptionalEntry(
        key: string
    ): OptionalValue<T>
}