
/**
 * cc means 'change context'. It creates a new scope in which a variable name can be used again
 * (usually '$', a variable name that indicates the current context in exupery)
 * 
 * example: 
 * 
 * cc($[1], ($) => {
 *     //here $[1] has become $
 * })
 * 
 * @param context 
 * @param assign 
 * @returns 
 */
export default function _p_cc<T, Value>(
    context: T,
    assign: (context: T) => Value
): Value {
    return assign(context)
}
