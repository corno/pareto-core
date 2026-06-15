import * as p_ci from "../interface"
import __command_promise from './command_promise'
import { Command_Promise } from "../interface/Command_Promise"

export default function __command<
    Error,
    Dynamic_Parameters extends p_ci.Parameters
>(
    handler: ($: Dynamic_Parameters) => Command_Promise<Error>,
): p_ci.Command<
    Error,
    Dynamic_Parameters
> {
    return {
        'execute': (parameters, error_transformer) => {
            return __command_promise({
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
            })
        },
    }
}