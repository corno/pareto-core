
/**
 * cc means 'change context'. It creates a new scope in which a variable name can be used again
 * 
 * example: 
 * 
 * cc(
 *     my_func($),
 *     ($) => {
 *         //here the reuslt of my_func($) has become $
 *     }
 * )
 * 
 * @param context 
 * @param assign 
 * @returns 
 */
export default function p_change_context<T, Value>(
    context: T,
    assign: (context: T) => Value
): Value {
    return assign(context)
}
