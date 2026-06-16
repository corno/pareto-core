import * as p_di from "../../interface/data"
import { Command_Promise } from "../../interface/command/Command_Promise"

import { Command_Block } from "./Command_Block"
import command_promise from "./command_promise"
import handle_command_block from "./handle_command_block"

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