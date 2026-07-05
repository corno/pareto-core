import { type Abort } from "../../../interface/__internal/Abort"
import * as p_di from "../../../interface/data"

export type Refinement_Result<Output, Error> = {

    __extract_data: (
        on_success: ($: Output) => undefined,
        on_error: ($: Error) => undefined
    ) => undefined
    __decide: <T extends p_di.Value>(
        on_success: ($: Output) => T,
        on_error: ($: Error) => T
    ) => T

}

export default function create_refinement_context<
    Output extends p_di.Value,
    Error extends p_di.Value
>(
    callback: (abort: Abort<Error>) => Output,
): Refinement_Result<Output, Error> {
    return ({

        __extract_data(
            on_result: ($: Output) => undefined,
            on_error: ($: Error) => undefined
        ): undefined {
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
                    on_error(e.error)
                } else {
                    throw e // re-throw unexpected errors
                }
            }
        },
        __decide<T extends p_di.Value>(
            on_result: ($: Output) => T,
            on_error: ($: Error) => T,
        ): T {
            let out: T
            this.__extract_data(
                (result) => {
                    out = on_result(result)
                },
                (error) => {
                    out = on_error(error)
                }
            )
            return out!
        }
    })
}