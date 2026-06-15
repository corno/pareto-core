import * as p_ti from "../../interface/transformer"
import * as p_qi from "../../interface/query"
import create_refinement_context from "../__internal/sync/create_refinement_context"
import { Abort } from "../../interface/__internal/Abort"

/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_result or on_error callback will be called
 * @param on_result the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<Output, Error> = (
    on_result: ($: Output) => undefined,
    on_error: ($: Error) => undefined,
) => undefined


class Super_Query_Result_Class<Output, Error> implements p_qi.Super_Query_Result<Output, Error> {
    private executer: Executer<Output, Error>
    constructor(executer: Executer<Output, Error>) {
        this.executer = executer
    }
    
    transform<New_Output>(
        transformer: p_ti.Transformer<Output, New_Output>
    ): p_qi.Super_Query_Result<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    on_result(transformer($))
                },
                on_error,
            )
        })
    }

    query<New_Output>(
        queryer: p_qi.Query_Callback<New_Output, Error, Output>
    ): p_qi.Super_Query_Result<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    queryer($).__extract_data(
                        on_result,
                        on_error,
                    )
                },
                on_error,
            )
        })
    }

    refine<New_Output>(
        callback: ($: Output, abort: Abort<Error>) => New_Output,
    ): p_qi.Super_Query_Result<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    create_refinement_context<New_Output, Error>((abort) => callback($, abort)).__extract_data(
                        on_result,
                        on_error,
                    )
                },
                on_error,
            )
        })
    }

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: p_qi.Query_Callback<New_Error, Rework_Error, Error>,
        rework_error_transformer: p_ti.Transformer<Rework_Error, New_Error>,
    ): p_qi.Super_Query_Result<Output, New_Error> {
        return new Super_Query_Result_Class<Output, New_Error>((on_result, on_error) => {
            this.executer(
                on_result,
                ($) => {
                    error_reworker($).__extract_data(
                        (new_target_error) => {
                            on_error(new_target_error)
                        },
                        (rework_error) => {
                            on_error(rework_error_transformer(rework_error))
                        },
                    )
                },
            )
        })
    }

    __extract_data(
        on_result: ($: Output) => undefined,
        on_error: ($: Error) => undefined,
    ): undefined {
        this.executer(on_result, on_error)
    }
}


export default function super_query_result<T, E>(
    query_result: p_qi.Query_Result<T, E>,
): p_qi.Super_Query_Result<T, E> {
    return new Super_Query_Result_Class<T, E>((on_result, on_error) => {
        query_result.__extract_data(on_result, on_error)
    })

}