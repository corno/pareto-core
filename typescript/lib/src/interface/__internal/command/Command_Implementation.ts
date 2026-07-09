import * as p_di from "../../data.js"

import { type Command_Interface } from "./Command_Interface.js"
import { type Query_Interface } from "../query/Query_Interface.js"

export type Command_Implementation<
    My_Command extends Command_Interface<any, any>,
    Static_Parameters extends p_di.Value,
    Queries extends null | { [key: string]: Query_Interface<any, any, any> },
    Commands extends null | { [key: string]: Command_Interface<any, any> }
> = (
    $s: Static_Parameters,
    $q: Queries,
    $c: Commands,
) => My_Command
