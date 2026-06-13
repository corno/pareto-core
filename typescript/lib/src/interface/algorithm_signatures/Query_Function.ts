
import { Query } from "./Query"

export type Query_Function<
    Result,
    Error,
    Dynamic_Parameters,
    Static_Parameters,
    Query_Resources
> = (
    $s: Static_Parameters,
    $q: Query_Resources,
) => Query<
    Result,
    Error,
    Dynamic_Parameters
>
