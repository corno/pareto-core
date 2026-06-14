import * as _pi from "../../interface"
import * as _pqi from "../../query/interface"
import * as _pci from "../../command/interface"

import { Command_Block } from "./Command_Block"
import _command from "./command"
import __command_promise from "./command_promise"
import __handle_command_block from "./handle_command_block"

export default function command_procedure<
    Error,
    Dynamic_Parameters extends _pci.Parameters,
    Static_Parameters extends _pci.Parameters,
    Query_Resources extends null | { [key: string]: _pqi.Query<any, any, any> },
    Command_Resources extends null | { [key: string]: _pci.Command<any, any> },
>(
    execution_handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $qr: Query_Resources,
        $cr: Command_Resources,
    ) => Command_Block<Error>,
): _pci.Command_Procedure<
    _pci.Command<
        Error,
        Dynamic_Parameters
    >,
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