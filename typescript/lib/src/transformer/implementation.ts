export * as with from "./implementation/with.js"
export * as initialize from "./implementation/initialize.js"
export * as lookup from "./implementation/lookup.js"
export { default as implement_me } from "./implementation/implement_me.js"
export {
    default as unreachable_code_path,
    Unreachable_Code_Path_Error,
    EXIT_CODE_IMPLEMENTATION_ERROR,
} from "./implementation/unreachable_code_path.js"

import unreachable_code_path from "./implementation/unreachable_code_path.js"
import type * as p_di from "../schema.js"

export type Option<T extends p_di.Value> = readonly [string, T]

export function option<T extends p_di.Value, RT extends p_di.Value>(
    option: Option<T>,
    $c: ($: T) => RT,
): RT {
    return $c(option[1])
}

export function exhaustive<RT>(_x: never): RT {
    return unreachable_code_path("exhaustive: a state option that the type system excludes")
}
