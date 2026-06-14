import * as _pi from "../../interface"
import * as _pci from "../../command/interface"
import __command_promise from './command_promise'

export default function __command<
    Error,
    Dynamic_Parameters extends _pci.Parameters
>(
    handler: ($: Dynamic_Parameters) => _pci.Command_Promise<Error>,
): _pci.Command<
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