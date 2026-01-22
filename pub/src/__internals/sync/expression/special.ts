import * as _pi from "../../../interface"


export function assert<Return_Type, Error>(
    abort_callback: _pi.Abort<Error>,
    tester: () => _pi.Optional_Value<Error>,
    normal_flow: () => Return_Type
): Return_Type {
    const test_result = tester()
    test_result.__extract_data(
        ($) => {
            abort_callback($)
        },
        () => {

        }
    )
    return normal_flow()
}

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
export function deprecated_block<RT>(callback: () => RT): RT {
    return callback()
}

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
 * @param input 
 * @param callback 
 * @returns 
 */
export function deprecated_cc<T, RT>(input: T, callback: (output: T) => RT): RT {
    return callback(input)
}

export const iterate = <Element, Return_Type>(
    $: _pi.List<Element>,
    handler: ($iter: _pi.Iterator<Element>) => Return_Type,
): Return_Type => {

    const length = $.__get_number_of_elements()

    let position = 0

    return handler({
        'look': () => {
            return $.__get_element_at_raw(position)
        },
        'look ahead': (offset: number) => {
            return $.__get_element_at_raw(position + offset)
        },
        'consume': (
            callback,
            abort
        ) => {
            const current = $.__get_element_at(position, () => abort(position))
            position += 1            
            const result = callback(current, position)
            return result
        },
        'discard': <T>(
            callback: () => T
        ) => {
            position += 1
            return callback()
        },
        'get position': () => {
            return position
        },
        'assert finished': (
            callback,
            abort
        ) => {
            const result = callback()
            if (position < length) {
                return abort(null)
            }
            return result
        }
    })
}

export const location_to_string = ($: _pi.Deprecated_Source_Location): string => {
    return `${$.file}:${$.line}:${$.column}`
}

/**
 * call this function if an error is en encountered that is unrecoverable
 * and the application should terminate immediately
 * this avoids throwing an Error because those can always be caught, which could lead to
 * misuse of library functionality
 * 
 * @param message message to be printed on stderr
 */
export function panic(...message: string[]): never {
    throw new Error(`PANIC: ${message.join(" ")}`)
}

/**
 * call this function if an error is en encountered that is unrecoverable
 * and the application should terminate immediately
 * this avoids throwing an Error because those can always be caught, which could lead to
 * misuse of library functionality
 * 
 * @param message message to be printed on stderr
 */
export function unreachable_code_path(): never {
    throw new Error(`PANIC; this should have been an unreachable code path`)
}