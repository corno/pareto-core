import * as p_ti from "../../interface/transformer"
import * as p_di from "../../interface/data"
import * as p_qi from "../../interface/query"
import create_refinement_context from "../__internal/sync/create_refinement_context"
import { Abort } from "../../interface/__internal/Abort"


export type Query_Callback<
    Output extends p_di.Value,
    Error extends p_di.Value,
    Input extends p_di.Value
> = (
    $: Input,
) => p_qi.Query_Result<Output, Error>

/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_result or on_error callback will be called
 * @param on_result the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<Output extends p_di.Value, Error extends p_di.Value> = (
    on_result: ($: Output) => undefined,
    on_error: ($: Error) => undefined,
) => undefined


class Super_Query_Result_Class<
    Output extends p_di.Value,
    Error extends p_di.Value
> {
    public __extract_data: Executer<Output, Error>
    constructor(executer: Executer<Output, Error>) {
        this.__extract_data = executer
    }

    transform<New_Output extends p_di.Value>(
        transformer: p_ti.Transformer<Output, New_Output>
    ): Super_Query_Result_Class<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.__extract_data(
                ($) => {
                    on_result(transformer($))
                },
                on_error,
            )
        })
    }

    query<New_Output extends p_di.Value>(
        queryer: Query_Callback<New_Output, Error, Output>
    ): Super_Query_Result_Class<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.__extract_data(
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

    refine<New_Output extends p_di.Value>(
        callback: ($: Output, abort: Abort<Error>) => New_Output,
    ): Super_Query_Result_Class<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.__extract_data(
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

    rework_error_temp<
        New_Error extends p_di.Value,
        Rework_Error extends p_di.Value
    >(
        error_reworker: Query_Callback<New_Error, Rework_Error, Error>,
        rework_error_transformer: p_ti.Transformer<Rework_Error, New_Error>,
    ): Super_Query_Result_Class<Output, New_Error> {
        return new Super_Query_Result_Class<Output, New_Error>((on_result, on_error) => {
            this.__extract_data(
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
}


export default function super_query_result<
    T extends p_di.Value,
    E extends p_di.Value
>(
    query_result: p_qi.Query_Result<T, E>,
): Super_Query_Result_Class<T, E> {
    return new Super_Query_Result_Class<T, E>(query_result.__extract_data)

}