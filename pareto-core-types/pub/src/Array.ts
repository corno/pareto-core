import { AsyncValue } from "./AsyncValue"


/**
 * A Pareto array.
 * unmutable and minimal by design
 */
export interface Array<T> {
    /**
     * 
     * @param $v callback to transform an individual entry.
     */
    map<NT>(
        $v: ($: T) => NT
    ): Array<NT>

    /**
     * maps the array to {@link AsyncValue} that contains an array
     * @param $v callback that provides an async value. keys are not available.
     */
    asyncMap<NT>(
        $v: ($: T) => AsyncValue<NT>
    ): AsyncValue<Array<NT>>


    /**
     * This method is only to be used by resources
     * iterates over all entries
     * 
     * @param $v callback to process the entry
     */    __forEach(
        $v: ($: T) => void
    ): void


    /**
     * This method is only to be used by resources
     * 
     */
    __getLength(): number

    /**
     * This method is only to be used by resources
     * 
     * @param index 
     */
    __getElementAt(index: number): T //panics if index < 0 or index >= length
}