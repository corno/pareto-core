import * as _pi from  "../../interface"
import __command_promise from './command_promise'

export default function __command<Error, Parameters>(
    handler: ($: Parameters) => _pi.Command_Promise<Error>,
): _pi.Command<Error, Parameters> {
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