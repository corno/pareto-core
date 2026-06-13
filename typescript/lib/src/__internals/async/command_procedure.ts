import * as _pi from "../../interface"

import { Command_Block } from "./Command_Block"
import _command from "./command"
import __command_promise from "./command_promise"
import __handle_command_block from "./handle_command_block"

export default function command_procedure<
    Error,
    Dynamic_Parameters,
    Static_Parameters,
    Query_Resources,
    Command_Resources,
>(
    execution_handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $qr: Query_Resources,
        $cr: Command_Resources,
    ) => Command_Block<Error>,
): _pi.Command_Procedure<
    Error,
    Dynamic_Parameters,
    Static_Parameters,
    Query_Resources,
    Command_Resources
> {
    return ($s, $q, $c) => {
        return {
            'execute': ($d, error_transformer) => {
                return __command_promise({
                    'execute': (on_success, on_error) => {

                        __handle_command_block(execution_handler($d, $s, $q, $c)).__start(
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