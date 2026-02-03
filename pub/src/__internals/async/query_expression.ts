import * as _pi from "../../interface"
import { __query_result } from "./__query_result"
import { Query_Result } from "./Query_Result"
import { create_asynchronous_dictionary_builder } from "./asynchronous_collection_builder"
import { create_asynchronous_processes_monitor } from "./create_asynchronous_processes_monitor"


export namespace dictionaryx {

    export const parallel = <Result, Error, Entry_Error>(
        dictionary: _pi.Dictionary<Query_Result<Result, Entry_Error>>,
        aggregate_errors: _pi.Transformer<_pi.Dictionary<Entry_Error>, Error>,

    ): Query_Result<_pi.Dictionary<Result>, Error> => {
        return __query_result((on_success, on_error) => {
            let has_errors = false
            const errors_builder = create_asynchronous_dictionary_builder<Entry_Error>()
            const results_builder = create_asynchronous_dictionary_builder<Result>()

            create_asynchronous_processes_monitor(
                (monitor) => {
                    dictionary.__d_map(($, id) => {
                        monitor['report process started']()
                        $.__extract_data(
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
): Query_Result<Result, Error> => {
    return __query_result((on_success, on_error) => {
        on_success(result)
    })
}

export const direct_error = <T, E>(
    $: E
): Query_Result<T, E> => {
    return __query_result((on_value, on_error) => {
        on_error($)
    })
}
