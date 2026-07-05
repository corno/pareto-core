import * as p_di from "../../../interface/data/index.js"
import { type Command_Promise } from "../../../interface/command/__internal/Command_Promise.js"

import { type Command_Block } from "./Command_Block.js"
import command_promise from "./command_promise.js"
import handle_command_block from "./handle_command_block.js"

export type Option<T extends p_di.Value> = readonly [string, T]

/**
 * @deprecated use 'option' instead
 */
export function ss<
    T extends p_di.Value,
    Error extends p_di.Value
>(
    option: Option<T>,
    $c: ($: T) => Command_Block<Error>
): Command_Block<Error> {
    return $c(option[1])
}

export function option<
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