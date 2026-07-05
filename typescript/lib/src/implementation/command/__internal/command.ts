import * as p_ci from "../../../interface/command/index.js"
import * as p_di from "../../../interface/data/index.js"
import command_promise from "./command_promise.js"
import { type Command_Promise } from "../../../interface/command/__internal/Command_Promise.js"

export default function command<
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value
>(
    handler: ($: Dynamic_Parameters) => Command_Promise<Error>,
): p_ci.Command<
    Error,
    Dynamic_Parameters
> {
    return {
        'execute': (parameters, error_transformer) => command_promise({
            'execute': (on_success, on_error) => {
                handler(parameters).__start(
                    on_success,
                    (error) => {
                        on_error(
                            error_transformer(error)
                        )
                    }
                )
            }
        }),
    }
}