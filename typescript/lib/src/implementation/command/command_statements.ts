import * as p_ from "../../assign"
import * as p_di from "../../interface/data"
import * as p_ti from "../../interface/transformer"
import * as p_qi from "../../interface/query"
import * as p_ci from "../../interface/command"

import { Abort } from "../../interface/__internal/Abort"
import { Command_Block } from "./Command_Block"
import command_promise from "./command_promise"
import handle_command_block from "./handle_command_block"
import create_refinement_context from "../__internal/sync/create_refinement_context"
import create_asynchronous_dictionary_builder from "../__internal/async/asynchronous_dictionary_builder"
import create_asynchronous_processes_monitor from "../__internal/async/create_asynchronous_processes_monitor"
import { Command_Promise } from "../../interface/command/Command_Promise"

export function execute<
    Error extends p_di.Value,
    Dynamic_Parameters extends p_di.Value
>(
    command: p_ci.Command<Error, Dynamic_Parameters>,
    $d: Dynamic_Parameters,
    error_transformer: p_ti.Transformer<Error, Error>,
): Command_Promise<Error> {
    return command.execute($d, error_transformer)
}

export function dictionary<
    Entry_Error extends p_di.Value,
    T extends p_di.Value,
    Error extends p_di.Value
>(
    dictionary: p_di.Dictionary<T>,
    parametrized_command_block: (
        value: T,
        id: string
    ) => Command_Block<Entry_Error>,
    aggregate_errors: p_ti.Transformer<
        p_di.Dictionary<Entry_Error>,
        Error
    >,
): Command_Promise<Error> {
    return command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {

            const errors_builder = create_asynchronous_dictionary_builder<Entry_Error>()

            create_asynchronous_processes_monitor({
                monitoring_phase: (monitor) => {
                    dictionary.__get_raw_copy().forEach(($) => {
                        const id = $[0]
                        const value = $[1]
                        monitor['report_process_started']()

                        handle_command_block(parametrized_command_block(value, id)).__start(
                            () => {
                                monitor['report_process_finished']()
                            },
                            (e) => {
                                errors_builder['add entry'](id, e)
                                monitor['report_process_finished']()
                            }
                        )
                    })
                },
                on_all_finished: () => {
                    const errors = errors_builder['get dictionary']()
                    if (errors.__get_raw_copy().length === 0) {
                        on_success()
                    } else {
                        on_error(aggregate_errors(errors))
                    }
                }
            })
        }
    })
}

export function handle_error<
    Target_Error extends p_di.Value,
    Block_Error extends p_di.Value
>(
    command_block: Command_Block<Block_Error>,
    parametrized_command_block: ($v: Block_Error) => Command_Block<Target_Error>,
    assign_target_error: () => Target_Error,
): Command_Promise<Target_Error> {
    return command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            handle_command_block(command_block).__start(
                on_success,
                (e) => {
                    handle_command_block(parametrized_command_block(e)).__start(
                        () => {
                            on_error(assign_target_error())
                        },
                        on_error,
                    )
                }
            )
        }
    })
}

export function block<Error extends p_di.Value>(
    block: Command_Block<Error>,
): Command_Promise<Error> {
    return command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            handle_command_block(block).__start(
                on_success,
                on_error
            )
        }
    })
}

export function fail<Error extends p_di.Value>(
    error: Error,
): Command_Promise<Error> {
    return command_promise({
        'execute': (on_success, on_error) => {
            on_error(error)
        }
    })
}

export function query<
    Error extends p_di.Value,
    Query_Output extends p_di.Value
>(
    query_result: p_qi.Query_Result<Query_Output, Error>,
    parametrized_command_block: ($v: Query_Output) => Command_Block<Error>,
): Command_Promise<Error> {
    return command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            query_result.__extract_data(
                (output) => {
                    handle_command_block(parametrized_command_block(output)).__start(
                        on_success,
                        on_error
                    )
                },
                on_error
            )
        }
    })
}

export function refine<
    Error extends p_di.Value,
    Staging_Output extends p_di.Value
>(
    callback: (abort: Abort<Error>) => Staging_Output,
    parametrized_command_block: ($v: Staging_Output) => Command_Block<Error>,
): Command_Promise<Error> {
    return command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            create_refinement_context(callback).__extract_data(
                (output) => {
                    handle_command_block(parametrized_command_block(output)).__start(
                        on_success,
                        on_error,
                    )
                },
                on_error
            )
        }
    })
}

export function if_<Error extends p_di.Value>(
    precondition: boolean,
    command_block: Command_Block<Error>,
    else_command_block?: Command_Block<Error>,
): Command_Promise<Error> {
    return command_promise({
        'execute': (on_success, on_error) => {
            if (precondition) {
                handle_command_block(command_block).__start(
                    on_success,
                    on_error
                )
            } else {
                if (else_command_block !== undefined) {
                    handle_command_block(else_command_block).__start(
                        on_success,
                        on_error
                    )
                } else {
                    on_success()
                }
            }
        }
    })
}

export namespace if_ {




    /**
     * first run the query, then use if_.direct
     */
    export function query_deprecated<Error extends p_di.Value>(
        precondition: p_qi.Query_Result<boolean, Error>,
        command_block: Command_Block<Error>,
        else_command_block?: Command_Block<Error>,
    ): Command_Promise<Error> {
        return command_promise({
            'execute': (on_success, on_error) => {
                precondition.__extract_data(
                    ($) => {
                        if ($) {
                            handle_command_block(command_block).__start(
                                on_success,
                                on_error
                            )
                        } else {
                            if (else_command_block !== undefined) {
                                handle_command_block(else_command_block).__start(
                                    on_success,
                                    on_error
                                )
                            } else {
                                on_success()
                            }
                        }
                    },
                    on_error
                )
            }
        })
    }


}

export function test_for_successful_execution<
    Target_Error extends p_di.Value,
    Block_Error extends p_di.Value
>(
    command_block: Command_Block<Block_Error>,
    on_result: ($: p_di.Optional_Value<Block_Error>) => Command_Block<Target_Error>,
): Command_Promise<Target_Error> {
    return command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            handle_command_block(command_block).__start(
                () => {
                    handle_command_block(on_result(p_.literal.not_set())).__start(
                        on_success,
                        on_error,
                    )
                },
                (e) => {
                    handle_command_block(on_result(p_.literal.set(e))).__start(
                        on_success,
                        on_error,
                    )
                }
            )
        }
    })
}

export function assert<Error extends p_di.Value>(
    assertion: boolean,
    error_if_failed: Error,
): Command_Promise<Error> {
    return command_promise({
        'execute': (on_success, on_error) => {
            if (!assertion) {
                on_error(error_if_failed)
                return
            }
            on_success()
        }
    })
}

export namespace assert {

    /**
     * first run the query, then use assert.direct
     */
    export function query_deprecated<Error extends p_di.Value>(
        assertion: p_qi.Query_Result<boolean, Error>,
        error_if_failed: Error,
    ): Command_Promise<Error> {
        return command_promise({
            'execute': (on_success, on_error) => {
                assertion.__extract_data(
                    ($) => {
                        if ($) {
                            on_success()
                        } else {
                            on_error(error_if_failed)
                        }
                    },
                    on_error
                )
            }
        })
    }
}

