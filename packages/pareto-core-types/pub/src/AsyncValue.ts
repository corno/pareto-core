
/**
 * A value that will asynchronously become available.
 * Similar to the concept of a promise, but much simpler
 */
export interface AsyncValue<T> {

    /**
     * maps the current async value into a new async value
     * @param $v callback that transforms the actual value into a new AsyncValue
     */
    map<NT>($v: ($: T) => AsyncValue<NT>): AsyncValue<NT>
    
    /**
     * This method is only to be used by resources
     */
    __execute(
        $i: ($: T) => void
    ): void
}