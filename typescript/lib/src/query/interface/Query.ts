import * as p_ti from "../../transformer/interface"
import { Parameters } from "./Parameters"
import { Query_Result } from "./Query_Result"

export type Query<
    Output,
    Error,
    Input extends Parameters
> = <Target_Error>(
    $: Input,
    error_transformer: p_ti.Transformer<Error, Target_Error>,
) => Query_Result<
    Output,
    Target_Error
>