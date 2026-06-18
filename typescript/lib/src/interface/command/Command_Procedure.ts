import * as p_qi from "../query"
import * as p_di from "../data"

import { Command } from "./Command"

export type Command_Procedure<
    My_Command extends Command<any, any>,
    Static_Parameters extends p_di.Value,
    Queries extends null | { [key: string]: p_qi.Query<any, any, any> },
    Commands extends null | { [key: string]: Command<any, any> }
> = (
    $s: Static_Parameters,
    $q: Queries,
    $c: Commands,
) => My_Command
