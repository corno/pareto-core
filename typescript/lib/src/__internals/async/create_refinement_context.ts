import * as _pi from  "../../interface"


export type Refinement_Result<Output, Error> = {

    __extract_data: <T>(
        on_success: ($: Output) => T,
        on_error: ($: Error) => T
    ) => T

}

export default function create_refinement_context <Output, Error>(
    callback: (abort: _pi.Abort<Error>) => Output,
): Refinement_Result<Output, Error> {
    return ({
        __extract_data<T>(
            on_result: ($: Output) => T,
            on_error: ($: Error) => T,
        ): T {
            class Refine_Guard_Abort_Error<Error> {
                constructor(
                    public readonly error: Error,
                ) { }
            }
            try {
                return on_result(
                    callback(
                        (error) => {
                            throw new Refine_Guard_Abort_Error(error);
                        }
                    )
                )
            } catch (e) {
                if (e instanceof Refine_Guard_Abort_Error) {
                    return on_error(e.error)
                } else {
                    throw e // re-throw unexpected errors
                }
            }
        }
    })
}