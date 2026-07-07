import * as p_ti from "../../transformer.js"
import * as p_di from "../../data.js"
import { type Query_Result } from "./Query_Result.js"

export type Query_Action<
    Output extends p_di.Value,
    Error extends p_di.Value,
    Input extends p_di.Value
> = <Target_Error extends p_di.Value>(
    $: Input,
    error_transformer: p_ti.Transformer<Error, Target_Error>,
) => Query_Result<
    Output,
    Target_Error
>