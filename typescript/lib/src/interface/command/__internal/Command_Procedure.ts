import * as p_qi from "../../query/index.js"
import * as p_di from "../../data/index.js"

import { type Command } from "./Command.js"

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
