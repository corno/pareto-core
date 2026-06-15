import * as p_ci from "../interface"
import * as p_di from "../../data/interface"

import command_procedure from "./command_procedure"
import __command_promise from "./command_promise"
import __command from "./command"

export {
    command_procedure,
    __command_promise,
    __command
}

export * from "../../__internals/sync/literal"
export * from "./command_procedure"
export * from "./command_promise"
export * from "./command"
export * from "./command_statement"
export * from "./Command_Block"

export type Option<T extends p_di.Value> = readonly [string, T]

export function ss<T extends p_di.Value, RT extends p_ci.Command_Promise<any>>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

export function au<RT extends p_ci.Command_Promise<any>>(
    _x: never
): RT {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends p_di.State,
        RT extends p_ci.Command_Promise<any>
    >(
        state: T,
        assign: (output: T) => RT
    ): RT => {
        return assign(state)
    }

}