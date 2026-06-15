
export type Command_Promise<Error> = {
    __start: (
        on_success: () => undefined,
        on_error: (error: Error) => undefined,
    ) => undefined
}