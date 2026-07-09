import * as p_di from "../../../interface/data.js"
import command_promise from "./command_promise.js"
import { type Command_Promise } from "../../../interface/__internal/command/Command_Promise.js"
import { type Command_Interface } from "../../../interface/__internal/command/Command_Interface.js"

export default function <
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value
>(
    handler: ($: Dynamic_Parameters) => Command_Promise<Error>,
): Command_Interface<
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