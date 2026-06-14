import * as _pqi from "../../query/interface"
import * as _pi from "../../interface"

export type Command_Procedure<
    My_Command extends Command<any, any>,
    Static_Parameters extends _pqi.Parameters,
    Query_Resources extends null | { [key: string]: _pqi.Query<any, any, any> },
    Command_Resources extends null | { [key: string]: Command<any, any> }
> = (
    $s: Static_Parameters,
    $q: Query_Resources,
    $c: Command_Resources,
) => My_Command


export type Command<
    Error,
    Dynamic_Parameters extends _pqi.Parameters
> = {
    //these are actions, and should ideally be written like execute.direct(Command, error_transformer, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(error_transformer, parameters)
    'execute': <Target_Error>(
        $d: Dynamic_Parameters,
        error_transformer: _pi.Transformer<Error, Target_Error>,
    ) => Command_Promise<Target_Error>,
}

export type Command_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void
}