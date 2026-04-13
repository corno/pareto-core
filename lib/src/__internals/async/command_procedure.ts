import * as _pi from "../../interface"

import { __command } from "./command"
import { __command_promise } from "./command_promise"
import { __handle_command_block } from "./handle_command_block"
import { Command_Block } from "./Command_Block"

export const command_procedure = <Error, Parameters, Command_Resources, Query_Resources>(
    execution_handler: (
        $p: Parameters,
        $cr: Command_Resources,
        $qr: Query_Resources,
    ) => Command_Block<Error>,
): _pi.Command_Procedure<_pi.Command<Error, Parameters>, Command_Resources, Query_Resources> => {
    return ($cr, $qr) => {
        return {
            'execute': (parameters, error_transformer) => {
                return __command_promise({
                    'execute': (on_success, on_error) => {

                        __handle_command_block(execution_handler(parameters, $cr, $qr)).__start(
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