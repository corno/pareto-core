import * as p_di from "../../../schema.js"

export type Command_Promise<
Error extends p_di.Value
> = {
    __start: (
        on_success: () => undefined,
        on_error: (error: Error) => undefined,
    ) => undefined
}