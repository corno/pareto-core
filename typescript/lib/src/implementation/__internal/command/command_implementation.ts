import * as p_di from "../../../interface/data.js"

import { type Command_Interface } from "../../../interface/__internal/command/Command_Interface.js"
import { type Command_Block } from "./Command_Block.js"
import { type Command_Implementation } from "../../../interface/__internal/command/Command_Implementation.js"
import { type Query_Interface } from "../../../interface/__internal/query/Query_Interface.js"
import command_promise from "./command_promise.js"
import handle_command_block from "./handle_command_block.js"

export default function <
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value,
    Static_Parameters extends p_di.Value,
    Query_Resources extends null | { [key: string]: Query_Interface<any, any, any> },
    Command_Resources extends null | { [key: string]: Command_Interface<any, any> },
>(
    execution_handler: (
        $d: Dynamic_Parameters,
        $s: Static_Parameters,
        $qr: Query_Resources,
        $cr: Command_Resources,
    ) => Command_Block<Error>,
): Command_Implementation<
    Command_Interface<
        Error,
        Dynamic_Parameters
    >,
    Static_Parameters,
    Query_Resources,
    Command_Resources
> {
    return ($s, $q, $c) => {
        return {
            'execute': ($d, error_transformer) => command_promise({
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
            }),
        }
    }
}