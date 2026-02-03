
/**
 * call this function if an error is en encountered that is unrecoverable
 * and the application should terminate immediately
 * this avoids throwing an Error because those can always be caught, which could lead to
 * misuse of library functionality
 * 
 * @param message message to be printed on stderr
 */
export default function _p_unreachable_code_path(): never {
    throw new Error(`PANIC; this should have been an unreachable code path`)
}