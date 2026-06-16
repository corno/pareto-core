
export interface Query_Result<Output, Error> {

    __extract_data: (
        on_success: ($: Output) => undefined,
        on_error: ($: Error) => undefined
    ) => undefined

}