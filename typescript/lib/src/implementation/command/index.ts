import * as p_di from "../../interface/data"
import { Command_Promise } from "../../interface/command/Command_Promise"

import command_procedure from "./command_procedure"
import command_promise from "./command_promise"
import command from "./command"
import { Command_Block } from "./Command_Block"
import handle_command_block from "./handle_command_block"

export {
    command_procedure,
    command_promise,
    command
}

export * as literal from "../__internal/sync/literal"

export * from "./command_procedure"
// export * from "./command_promise"
// export * from "./command"
export * from "./command_statements"
export * from "./Command_Block"
export * from "../../interface/command/Command_Promise" //useful for cases where typescript cannot infer the type

export type Option<T extends p_di.Value> = readonly [string, T]

export function ss<T extends p_di.Value, RT>(
    option: Option<T>,
    $c: ($: T) => Command_Block<RT>
): Command_Block<RT> {
    return $c(option[1])
}

export function au<RT>(
    _x: never
): Command_Block<RT> {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends p_di.State,
        RT
    >(
        state: T,
        assign: (output: T) => Command_Block<RT>
    ): Command_Promise<RT> => {

        return command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {
                handle_command_block(assign(state)).__start(
                    on_success,
                    on_error
                )
            }
        })
    }

}