import { Parameters } from "../Parameters"
import { Query_Result } from "./Query_Result"
import { Transformer } from "./Transformer"

export type Query<
    Output,
    Error,
    Input extends Parameters
> = <Target_Error>(
    $: Input,
    error_transformer: Transformer<Error, Target_Error>,
) => Query_Result<
    Output,
    Target_Error
>