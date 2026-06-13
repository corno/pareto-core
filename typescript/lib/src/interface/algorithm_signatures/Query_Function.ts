
import { Parameters } from "../Parameters"
import { Query } from "./Query"

export type Query_Function<
    My_Query extends Query<any, any, any>,
    Static_Parameters extends Parameters,
    Query_Resources extends null | { [key: string]: Query<any, any, any> }
> = (
    $s: Static_Parameters,
    $q: Query_Resources,
) => My_Query
