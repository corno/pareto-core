
import * as p_di from "../../data.js"
import { type Query_Action } from "./Query_Action.js"

export type Query<
    My_Query extends Query_Action<any, any, any>,
    Static_Parameters extends p_di.Value,
    Queries extends null | { [key: string]: Query_Action<any, any, any> }
> = (
    $s: Static_Parameters,
    $q: Queries,
) => My_Query
