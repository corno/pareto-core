import * as p_ti from "../../interface/transformer.js"
import * as p_di from "../../schema.js"
import create_refinement_context from "../sync/create_refinement_context.js"
import { type Abort } from "../Abort.js"
import { type Query_Result } from "../../interface/__internal/query/Query_Result.js"

import create_asynchronous_dictionary_builder from "../async/asynchronous_dictionary_builder.js"
import create_asynchronous_processes_monitor from "../async/create_asynchronous_processes_monitor.js"
import * as lit from "../sync/literal.js"

export type Query_Callback<
    Output extends p_di.Value,
    Error extends p_di.Value,
    Input extends p_di.Value
> = (
    $: Input,
) => Query_Result<Output, Error>

/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_result or on_error callback will be called
 * @param on_result the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<
    Output extends p_di.Value,
    Error extends p_di.Value
> = (
    on_result: ($: Output) => undefined,
    on_error: ($: Error) => undefined,
) => undefined

type Group_Result<T> =
    T extends Query_Result<infer Output, any>
    ? Output
    : never

type Group_Results<T extends readonly Query_Result<p_di.Value, p_di.Value>[]> =
    { [K in keyof T]: Group_Result<T[K]> } & p_di.Value


export class Super_Query_Result_Class<
    Output extends p_di.Value,
    Error extends p_di.Value
> {
    public __extract_data: Executer<Output, Error>
    constructor(executer: Executer<Output, Error>) {
        this.__extract_data = executer
    }

    dictionary<
        Entry extends p_di.Value,
        Result extends p_di.Value,
        Entry_Error extends p_di.Value
    >(
        dictionary_getter: ($: Output) => p_di.Dictionary<Entry>,
        map_entry: ($: Entry, id: string) => Query_Result<Result, Entry_Error>,
        aggregate_errors: p_ti.Transformer<p_di.Dictionary<Entry_Error>, Error>,

    ): Query_Result<p_di.Dictionary<Result>, Error> {
        return new Super_Query_Result_Class<p_di.Dictionary<Result>, Error>((on_success, on_error) => {

            this.__extract_data(
                ($) => {

                    let has_errors = false


                    const errors_builder = create_asynchronous_dictionary_builder<Entry_Error>()
                    const results_builder = create_asynchronous_dictionary_builder<Result>()

                    create_asynchronous_processes_monitor({
                        monitoring_phase: (monitor) => {
                            dictionary_getter($).__get_raw().forEach(([id, value]) => {
                                monitor['report_process_started']()
                                map_entry(value, id).__extract_data(
                                    ($) => {
                                        results_builder['add entry'](id, $)
                                        monitor['report_process_finished']()
                                    },
                                    ($) => {
                                        has_errors = true
                                        errors_builder['add entry'](id, $)
                                        monitor['report_process_finished']()
                                    },
                                )
                                return null
                            })
                        },
                        on_all_finished: () => {
                            if (has_errors) {
                                on_error(aggregate_errors(errors_builder['get dictionary']()))
                            } else {
                                on_success(results_builder['get dictionary']())
                            }
                        }
                    })
                },
                on_error,
            )
        })
    }

    group<
        Entry_Error extends p_di.Value,
        const T extends readonly Query_Result<p_di.Value, Entry_Error>[],
    >(
        group_getter: ($: Output) => [...T],
        aggregate_errors: p_ti.Transformer<p_di.List<Entry_Error>, Error>,
    ): Query_Result<Group_Results<T>, Error> {
        return new Super_Query_Result_Class<Group_Results<T>, Error>((on_success, on_error) => {
            this.__extract_data(
                ($) => {
                    let has_errors = false
                    const errors: Entry_Error[] = []
                    const results: p_di.Value[] = []

                    create_asynchronous_processes_monitor({
                        monitoring_phase: (monitor) => {
                            group_getter($).forEach((query_result, index) => {
                                monitor['report_process_started']()
                                query_result.__extract_data(
                                    (result) => {
                                        results[index] = result
                                        monitor['report_process_finished']()
                                    },
                                    (error) => {
                                        has_errors = true
                                        errors.push(error)
                                        monitor['report_process_finished']()
                                    },
                                )
                                return null
                            })
                        },
                        on_all_finished: () => {
                            if (has_errors) {
                                on_error(aggregate_errors(lit.list(errors)))
                            } else {
                                on_success(results as unknown as Group_Results<T>)
                            }
                        },
                    })
                },
                on_error,
            )
        })
    }

    direct_error(
        $: Error
    ): Query_Result<never, Error> {
        return new Super_Query_Result_Class<never, Error>((on_result, on_error) => {
            on_error($)
        })
    }

    direct_result<
        Result extends p_di.Value,
    >(
        result: Result,
    ): Query_Result<Result, never> {
        return new Super_Query_Result_Class<Result, never>((on_success, on_error) => {
            on_success(result)
        })
    }

    observe_behavior<
        Preparation_Result extends p_di.Value,
        Preparation_Error extends p_di.Value,
        Target_Outcome extends p_di.Value
    >(
        result_getter: ($: Output) => Query_Result<Preparation_Result, Preparation_Error>,
        handlers: {
            success: (result: Preparation_Result) => Query_Result<Target_Outcome, Error>,
            error: (error: Preparation_Error) => Query_Result<Target_Outcome, Error>,
        },
    ): Query_Result<Target_Outcome, Error> {
        return new Super_Query_Result_Class<Target_Outcome, Error>((onResult, onError) => {
            this.__extract_data(
                ($) => {
                    result_getter($).__extract_data(
                        (r) => {
                            handlers.success(r).__extract_data(onResult, onError)
                        },
                        (e) => {
                            handlers.error(e).__extract_data(onResult, onError)
                        }
                    )
                },
                onError,
            )
        })
    }

    query<
        New_Output extends p_di.Value,
    >(
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

    refine<
        New_Output extends p_di.Value
    >(
        callback: (
            $: Output,
            abort: Abort<Error>
        ) => New_Output,
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

    temp_expression<
        New_Output extends p_di.Value
    >(
        callback: ($: Output) => Query_Result<New_Output, Error>
    ): Super_Query_Result_Class<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.__extract_data(
                ($) => {
                    callback($).__extract_data(
                        on_result,
                        on_error,
                    )
                },
                on_error,
            )
        })
    }

    transform<
        New_Output extends p_di.Value
    >(
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

    try_and_catch<
        New_Output extends p_di.Value,
        Inner_Error extends p_di.Value,
    >(
        try_: (e: Super_Query_Result_Class<Output, Inner_Error>) => Query_Result<New_Output, Inner_Error>,
        catch_: (e: Inner_Error) => Query_Result<New_Output, Error>,
    ): Super_Query_Result_Class<New_Output, Error> {
        return new Super_Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.__extract_data(
                ($) => {
                    try_(
                        new Super_Query_Result_Class<Output, Inner_Error>(
                            (on_result, on_error) => {
                                on_result($)
                                return undefined
                            }
                        )
                    ).__extract_data(
                        on_result,
                        ($) => {
                            catch_($).__extract_data(
                                on_result,
                                on_error,
                            )
                        },
                    )
                },
                on_error,
            )
        })
    }
}


export default function <
    T extends p_di.Value,
    E extends p_di.Value
>(
    query_result: Query_Result<T, E>,
): Super_Query_Result_Class<T, E> {
    return new Super_Query_Result_Class<T, E>(query_result.__extract_data)

}