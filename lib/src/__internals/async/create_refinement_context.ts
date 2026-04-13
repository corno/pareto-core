import * as _pi from  "../../interface"


export type Refinement_Result<Output, Error> = {

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

export const create_refinement_context = <Output, Error>(
    callback: (abort: _pi.Abort<Error>) => Output,
): Refinement_Result<Output, Error> => {
    return ({
        __extract_data(
            on_result: ($: Output) => void,
            on_error: ($: Error) => void,
        ): void {
            class Refine_Guard_Abort_Error<Error> {
                constructor(
                    public readonly error: Error,
                ) { }
            }
            try {
                on_result(
                    callback(
                        (error) => {
                            throw new Refine_Guard_Abort_Error(error);
                        }
                    )
                )
            } catch (e) {
                if (e instanceof Refine_Guard_Abort_Error) {
                    on_error(e.error)
                } else {
                    throw e // re-throw unexpected errors
                }
            }
        }
    })
}