import { Transformer } from "./Transformer"

export type Command_Procedure<
    Error,
    Dynamic_Parameters,
    Static_Parameters,
    Query_Resources,
    Command_Resources
> = (
    $s: Static_Parameters,
    $q: Query_Resources,
    $c: Command_Resources,
) => Command<Error, Dynamic_Parameters>

export type Command<
    Error,
    Dynamic_Parameters
> = {
    //these are actions, and should ideally be written like execute.direct(Command, error_transformer, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(error_transformer, parameters)
    'execute': <Target_Error>(
        $d: Dynamic_Parameters,
        error_transformer: Transformer<Error, Target_Error>,
    ) => Command_Promise<Target_Error>,
}

export type Command_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void
}