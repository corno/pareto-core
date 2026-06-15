import * as p_qi from "../query"
import * as p_ti from "../transformer"
import { Command_Promise } from "./Command_Promise"

export type Command_Procedure<
    My_Command extends Command<any, any>,
    Static_Parameters extends p_qi.Parameters,
    Query_Resources extends null | { [key: string]: p_qi.Query<any, any, any> },
    Command_Resources extends null | { [key: string]: Command<any, any> }
> = (
    $s: Static_Parameters,
    $q: Query_Resources,
    $c: Command_Resources,
) => My_Command


export type Command<
    Error,
    Dynamic_Parameters extends p_qi.Parameters
> = {
    //these are actions, and should ideally be written like execute.direct(Command, error_transformer, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(error_transformer, parameters)
    'execute': <Target_Error>(
        $d: Dynamic_Parameters,
        error_transformer: p_ti.Transformer<Error, Target_Error>,
    ) => Command_Promise<Target_Error>,
}
