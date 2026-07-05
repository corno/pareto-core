import * as p_di from "../../data"
import * as p_ti from "../../transformer"
import { type Command_Promise } from "./Command_Promise"

export type Command<
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value
> = {
    'execute': <Target_Error extends p_di.Value>(
        $d: Dynamic_Parameters,
        error_transformer: p_ti.Transformer<Error, Target_Error>,
    ) => Command_Promise<Target_Error>,
}
