import * as _pi from "./interface"
import * as _pci from "./command_interface"

import command_procedure from "./__internals/async/command_procedure"
import __command_promise from "./__internals/async/command_promise"
import __command from "./__internals/async/command"

export {
    command_procedure,
    __command_promise,
    __command
}

export * from "./__internals/sync/extracts_for_async"
export * from "./__internals/async/command_procedure"
export * from "./__internals/async/command_promise"
export * from "./__internals/async/command"
export * from "./__internals/async/command_statement"
export * from "./__internals/async/Command_Block"

export type Option<T extends _pi.Value> = readonly [string, T]

export function ss<T extends _pi.Value, RT extends _pci.Command_Promise<any>>(
    option: Option<T>,
    $c: ($: T) => RT): RT {
    return $c(option[1])
}

export function au<RT extends _pci.Command_Promise<any>>(
    _x: never
): RT {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends _pi.State,
        RT extends _pci.Command_Promise<any>
    >(
        state: T,
        assign: (output: T) => RT
    ): RT => {
        return assign(state)
    }

}