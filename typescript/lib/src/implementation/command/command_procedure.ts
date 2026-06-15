import * as p_qi from "../../interface/query"
import * as p_ci from "../../interface/command"

import { Command_Block } from "./Command_Block"
import command_promise from "./command_promise"
import handle_command_block from "./handle_command_block"

export default function command_procedure<
    Error,
    Dynamic_Parameters extends p_ci.Parameters,
    Static_Parameters extends p_ci.Parameters,
    Query_Resources extends null | { [key: string]: p_qi.Query<any, any, any> },
    Command_Resources extends null | { [key: string]: p_ci.Command<any, any> },
>(
    execution_handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $qr: Query_Resources,
        $cr: Command_Resources,
    ) => Command_Block<Error>,
): p_ci.Command_Procedure<
    p_ci.Command<
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
                return command_promise({
                    'execute': (on_success, on_error) => {

                        handle_command_block(execution_handler($d, $s, $q, $c)).__start(
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