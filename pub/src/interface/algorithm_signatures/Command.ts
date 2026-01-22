import { Transformer } from "./Transformer"

export type Command_Procedure<Command, Command_Resources, Query_Resources> = ($c: Command_Resources, $q: Query_Resources) => Command

export type Command<Error, Parameters> = {
    //these are actions, and should ideally be written like execute.direct(Command, error_transformer, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(error_transformer, parameters)
    'execute': <Target_Error>(
            parameters: Parameters,
            error_transformer: Transformer<Error, Target_Error>,
        ) => Command_Promise<Target_Error>,
}

export type Command_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void
}