import * as p_di from "../../data/index.js"
import * as p_ti from "../../transformer/index.js"
import { type Command_Promise } from "./Command_Promise.js"

export type Command<
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value
> = {
    'execute': <Target_Error extends p_di.Value>(
        $d: Dynamic_Parameters,
        error_transformer: p_ti.Transformer<Error, Target_Error>,
    ) => Command_Promise<Target_Error>,
}
