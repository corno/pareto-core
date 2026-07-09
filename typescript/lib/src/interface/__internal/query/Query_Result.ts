import * as p_di from "../../data.js"

export interface Query_Result<
    Output extends p_di.Value,
    Error extends p_di.Value
> {

    __extract_data: (
        on_success: ($: Output) => undefined,
        on_error: ($: Error) => undefined
    ) => undefined

}