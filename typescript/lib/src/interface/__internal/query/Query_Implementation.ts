
import * as p_di from "../../data.js"
import { type Query_Interface } from "./Query_Interface.js"

export type Query_Implementation<
    My_Query extends Query_Interface<any, any, any>,
    Static_Parameters extends p_di.Value,
    Queries extends null | { [key: string]: Query_Interface<any, any, any> }
> = (
    $s: Static_Parameters,
    $q: Queries,
) => My_Query
