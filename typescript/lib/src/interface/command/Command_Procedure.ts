import * as p_qi from "../query"
import * as p_di from "../data"

import { Command } from "./Command"

export type Command_Procedure<
    My_Command extends Command<any, any>,
    Static_Parameters extends p_di.Value,
    Query_Resources extends null | { [key: string]: p_qi.Query<any, any, any> },
    Command_Resources extends null | { [key: string]: Command<any, any> }
> = (
    $s: Static_Parameters,
    $q: Query_Resources,
    $c: Command_Resources,
) => My_Command
