import * as p_qi from "../../interface/query"
import * as p_ti from "../../interface/transformer"
import * as p_di from "../../interface/data"
import query_result from "./query_result"
import create_asynchronous_dictionary_builder from "../__internal/async/asynchronous_dictionary_builder"
import create_asynchronous_processes_monitor from "../__internal/async/create_asynchronous_processes_monitor"
import { Abort } from "../../interface/__internal/Abort"
import create_refinement_context from "../__internal/sync/create_refinement_context"

export function dictionary<
    Entry extends p_di.Value,
    Result extends p_di.Value,
    Error extends p_di.Value,
    Entry_Error extends p_di.Value
>(
    dictionary: p_di.Dictionary<Entry>,
    map_entry: ($: Entry, id: string) => p_qi.Query_Result<Result, Entry_Error>,
    aggregate_errors: p_ti.Transformer<p_di.Dictionary<Entry_Error>, Error>,

): p_qi.Query_Result<p_di.Dictionary<Result>, Error> {
    return query_result((on_success, on_error) => {
        let has_errors = false
        const errors_builder = create_asynchronous_dictionary_builder<Entry_Error>()
        const results_builder = create_asynchronous_dictionary_builder<Result>()

        create_asynchronous_processes_monitor({
            monitoring_phase: (monitor) => {
                dictionary.__d_map_deprecated(($, id) => {
                    monitor['report_process_started']()
                    map_entry($, id).__extract_data(
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
    })
}

export function direct_result<
    Result extends p_di.Value,
    Error extends p_di.Value
>(
    result: Result,
): p_qi.Query_Result<Result, Error> {
    return query_result((on_success, on_error) => {
        on_success(result)
    })
}

export function direct_error<
    T extends p_di.Value,
    E extends p_di.Value
>(
    $: E
): p_qi.Query_Result<T, E> {
    return query_result((on_value, on_error) => {
        on_error($)
    })
}

export function refine<
    T extends p_di.Value,
    E extends p_di.Value
>(
    callback: (
        abort: Abort<E>
    ) => T
): p_qi.Query_Result<T, E> {
    return query_result((on_value, on_error) => {
        create_refinement_context<T, E>(
            (abort) => callback(abort),
        ).__extract_data(
            on_value,
            on_error,
        )
    })
}

export function transform<
    T extends p_di.Value,
    E extends p_di.Value
>(
    callback: (
    ) => T
): p_qi.Query_Result<T, E> {
    return query_result((on_value, on_error) => {
        on_value(callback())
    })
}

/**
 * try the query, handle the succes result and catch the error
 */
export function observe_behavior<
    Preparation_Result extends p_di.Value,
    Preparation_Error extends p_di.Value,
    Target_Outcome extends p_di.Value,
    Target_Error extends p_di.Value
>(
    result: p_qi.Query_Result<Preparation_Result, Preparation_Error>,
    handlers: {
        success: (result: Preparation_Result) => p_qi.Query_Result<Target_Outcome, Target_Error>,
        error: (error: Preparation_Error) => p_qi.Query_Result<Target_Outcome, Target_Error>,
    },
): p_qi.Query_Result<Target_Outcome, Target_Error> {
    return query_result<Target_Outcome, Target_Error>((onResult, onError) => {
        result.__extract_data(
            (r) => {
                handlers.success(r).__extract_data(onResult, onError)
            },
            (e) => {
                handlers.error(e).__extract_data(onResult, onError)
            }
        )
    })
}