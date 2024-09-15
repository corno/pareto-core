
/**
 * this is literal data type, either [false] or [true, T]
 * the first entry of the tuple is thus 'false' or 'true'. If the first one is 'true',
 * then there is a second one containing the value T
 */
export type RawOptionalValue<T> = [false] | [true, T]

/**
 * Why this type and not use for example 'null | T'?
 * the 'null | T' is vulnerable. If you have a parametrized function 'foo<T>() null | T' and T is null | number,
 * you cannot discern if a return value is null because of the function or because of the data
 * this 'OptionalValue' type makes it possible to have recursive optional types like this: OptionalValue<OptionalValue<number>>
 */
export interface OptionalValue<T> {
    /**
     * 
     * @param set what to do when the value was set, returns the new type
     * @param notSet  what to do when the value was not set, returns the new type
     */
    map<NT>(
        set: ($: T) => NT,
        notSet: () => NT,
    ): NT
    /**
     * 
     */
    mapToNewOptional<NT>(
        set: ($: T) => NT,
    ): OptionalValue<NT>

    raw: RawOptionalValue<T>
}