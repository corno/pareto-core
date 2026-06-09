import * as _pi from "../../interface"

import { Command_Block } from "./Command_Block"
import _command from "./command"
import __command_promise from "./command_promise"
import __handle_command_block from "./handle_command_block"

export default function command_procedure<Error, Parameters, Command_Resources, Query_Resources, Context_Parameters>(
    execution_handler: (
        $p: Parameters,
        $cr: Command_Resources,
        $qr: Query_Resources,
        $x: Context_Parameters
    ) => Command_Block<Error>,
): _pi.Command_Procedure<
    _pi.Command<Error, Parameters>,
    Command_Resources,
    Query_Resources,
    Context_Parameters
> {
    return ($cr, $qr, $x) => {
        return {
            'execute': (parameters, error_transformer) => {
                return __command_promise({
                    'execute': (on_success, on_error) => {

                        __handle_command_block(execution_handler(parameters, $cr, $qr, $x)).__start(
                            on_success,
                            ($) => {
                                on_error(
                                    error_transformer($)
                                )
                            }
                        )
                    }
                })
            },
        }
    }
}