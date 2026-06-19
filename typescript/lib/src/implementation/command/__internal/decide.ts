import * as p_di from "../../../interface/data"
import { Command_Promise } from "../../../interface/command/__internal/Command_Promise"

import { Command_Block } from "./Command_Block"
import command_promise from "./command_promise"
import handle_command_block from "./handle_command_block"

export type Option<T extends p_di.Value> = readonly [string, T]

export function ss<
    T extends p_di.Value,
    Error extends p_di.Value
>(
    option: Option<T>,
    $c: ($: T) => Command_Block<Error>
): Command_Block<Error> {
    return $c(option[1])
}

export function au<
    Error extends p_di.Value
>(
    _x: never
): Command_Block<Error> {
    throw new Error("unreachable")
}

export namespace decide {

    export const state = <
        T extends p_di.State,
        Error extends p_di.Value
    >(
        state: T,
        assign: (output: T) => Command_Block<Error>
    ): Command_Promise<Error> => {

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