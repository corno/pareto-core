import * as p_qi from "../../interface/query"
import * as p_ti from "../../interface/transformer"
import * as p_di from "../../interface/data"
import __query_result from "./__query_result"
import create_asynchronous_dictionary_builder from "../__internal/async/asynchronous_dictionary_builder"
import create_asynchronous_processes_monitor from "../__internal/async/create_asynchronous_processes_monitor"
import { Abort } from "../../interface/__internal/Abort"
import create_refinement_context from "../__internal/sync/create_refinement_context"

export namespace dictionaryx {

    export const parallel = <
        Entry extends p_di.Value,
        Result extends p_di.Value,
        Error extends p_di.Value,
        Entry_Error extends p_di.Value
    >(
        dictionary: p_di.Dictionary<Entry>,
        map_entry: ($: Entry, id: string) => p_qi.Query_Result<Result, Entry_Error>,
        aggregate_errors: p_ti.Transformer<p_di.Dictionary<Entry_Error>, Error>,

    ): p_qi.Query_Result<p_di.Dictionary<Result>, Error> => {
        return __query_result((on_success, on_error) => {
            let has_errors = false
            const errors_builder = create_asynchronous_dictionary_builder<Entry_Error>()
            const results_builder = create_asynchronous_dictionary_builder<Result>()

            create_asynchronous_processes_monitor(
                (monitor) => {
                    dictionary.__d_map(($, id) => {
                        monitor['report process started']()
                        map_entry($, id).__extract_data(
                            ($) => {
                                results_builder['add entry'](id, $)
                                monitor['report process finished']()
                            },
                            ($) => {
                                has_errors = true
                                errors_builder['add entry'](id, $)
                                monitor['report process finished']()
                            },
                        )
                        return null
                    })
                },
                () => {
                    if (has_errors) {
                        on_error(aggregate_errors(errors_builder['get dictionary']()))
                    } else {
                        on_success(results_builder['get dictionary']())
                    }
                }
            )
        })
    }
}

export const direct_result = <Result, Error>(
    result: Result,
): p_qi.Query_Result<Result, Error> => {
    return __query_result((on_success, on_error) => {
        on_success(result)
    })
}

export const direct_error = <T, E>(
    $: E
): p_qi.Query_Result<T, E> => {
    return __query_result((on_value, on_error) => {
        on_error($)
    })
}

export const refine = <T, E>(
    callback: (
        abort: Abort<E>
    ) => T
): p_qi.Query_Result<T, E> => {
    return __query_result((on_value, on_error) => {
        create_refinement_context<T, E>(
            (abort) => callback(abort),
        ).__extract_data(
            on_value,
            on_error,
        )
    })
}