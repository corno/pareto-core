
/**
 * 
 * this function allows to create a statement block in an expression (without changing the context)
 * 
 * example: 
 * 
 * const result = 5 + (() => {
 *     const intermediate_variable = 4
 *     return intermediate_variable
 * })
 */
export default function _p_block_deprecated<RT>(callback: () => RT): RT {
    return callback()
}
