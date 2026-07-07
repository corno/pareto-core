import * as p_di from "../../data.js"

import { type Command_Action } from "./Command_Action.js"
import { type Query_Action } from "../query/Query_Action.js"

export type Command<
    My_Command extends Command_Action<any, any>,
    Static_Parameters extends p_di.Value,
    Queries extends null | { [key: string]: Query_Action<any, any, any> },
    Commands extends null | { [key: string]: Command_Action<any, any> }
> = (
    $s: Static_Parameters,
    $q: Queries,
    $c: Commands,
) => My_Command
