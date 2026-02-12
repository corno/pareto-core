import * as _pi from "../../interface"

import _p_iterate from "../../_p_iterate"

import { __command_promise } from "./command_promise"
import { __handle_command_block } from "./handle_command_block"
import { Command_Block } from "./Command_Block"
import { create_refinement_context } from "./create_refinement_context"
import { create_asynchronous_dictionary_builder } from "./asynchronous_collection_builder"
import { create_asynchronous_processes_monitor } from "./create_asynchronous_processes_monitor"
import { Query_Result } from "./Query_Result"


export namespace listx {

    export const serie = <Error>(
        array: _pi.List<_pi.Command_Promise<Error>>,
    ): _pi.Command_Promise<Error> => {
        return __command_promise({
            'execute': (on_success, on_error) => {
                _p_iterate(array, (iterator) => {
                    const do_next = () => {
                        const next = iterator.look()
                        if (next !== null) {
                            iterator.consume(
                                ($) => {
                                    $.__start(
                                        () => {
                                            do_next()
                                        },
                                        on_error
                                    )
                                },
                                {
                                    no_more_tokens: () => {
                                        throw new Error("not reachable, just did a look()")
                                    }
                                },
                            )
                        } else {
                            on_success()
                        }
                    }
                    do_next()
                })

            }
        })
    }
}

export namespace dictionaryx {

    export const parallel = <T, Error, Entry_Error>(
        dictionary: _pi.Dictionary<T>,
        parametrized_command_block: (value: T, id: string) => Command_Block<Entry_Error>,
        aggregate_errors: _pi.Transformer<_pi.Dictionary<Entry_Error>, Error>,
    ): _pi.Command_Promise<Error> => {
        return __command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                const errors_builder = create_asynchronous_dictionary_builder<Entry_Error>()

                create_asynchronous_processes_monitor(
                    (monitor) => {
                        dictionary.__d_map(($, id) => {
                            monitor['report process started']()

                            __handle_command_block(parametrized_command_block($, id)).__start(
                                () => {
                                    monitor['report process finished']()
                                },
                                (e) => {
                                    errors_builder['add entry'](id, e)
                                    monitor['report process finished']()
                                }
                            )
                        })
                    },
                    () => {
                        const errors = errors_builder['get dictionary']()
                        if (errors.__get_number_of_entries() === 0) {
                            on_success()
                        } else {
                            on_error(aggregate_errors(errors))
                        }
                    }
                )
            }
        })
    }

    export namespace deprecated_parallel {

        export const query = <T, Error, Entry_Error>(
            query_result: Query_Result<_pi.Dictionary<T>, Error>,
            parametrized_command_block: (value: T, id: string) => Command_Block<Entry_Error>,
            aggregate_errors: _pi.Transformer<_pi.Dictionary<Entry_Error>, Error>,
        ): _pi.Command_Promise<Error> => {
            return __command_promise({
                'execute': (
                    on_success,
                    on_error,
                ) => {

                    const errors_builder = create_asynchronous_dictionary_builder<Entry_Error>()

                    query_result.__extract_data(
                        (dictionary) => {
                            create_asynchronous_processes_monitor(
                                (monitor) => {
                                    dictionary.__d_map(($, id) => {
                                        monitor['report process started']()

                                        __handle_command_block(parametrized_command_block($, id)).__start(
                                            () => {
                                                monitor['report process finished']()
                                            },
                                            (e) => {
                                                errors_builder['add entry'](id, e)
                                                monitor['report process finished']()
                                            }
                                        )
                                    })
                                },
                                () => {
                                    const errors = errors_builder['get dictionary']()
                                    if (errors.__get_number_of_entries() === 0) {
                                        on_success()
                                    } else {
                                        on_error(aggregate_errors(errors))
                                    }
                                }
                            )
                        },
                        on_error
                    )
                }
            })
        }
    }
}

export const handle_error = <Target_Error, Block_Error>(
    command_block: Command_Block<Block_Error>,
    parametrized_command_block: ($v: Block_Error) => Command_Block<Target_Error>,
    assign_target_error: () => Target_Error,
): _pi.Command_Promise<Target_Error> => {
    return __command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            __handle_command_block(command_block).__start(
                on_success,
                (e) => {
                    __handle_command_block(parametrized_command_block(e)).__start(
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

export const nothing = <Error>(
): _pi.Command_Promise<Error> => {
    return __command_promise({
        'execute': (
            on_success,
        ) => {
            on_success()
        }
    })
}

export const fail = <Error>(
    error: Error,
): _pi.Command_Promise<Error> => {
    return __command_promise({
        'execute': (on_success, on_error) => {
            on_error(error)
        }
    })
}

export const query = <Error, Query_Output, Refine_Output>(
    query_result: Query_Result<Query_Output, Error>,
    refine: _pi.Refiner<Refine_Output, Error, Query_Output>,
    parametrized_command_block: ($v: Refine_Output) => Command_Block<Error>,
): _pi.Command_Promise<Error> => {
    return __command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            query_result.__extract_data(
                (output) => {
                    create_refinement_context<Refine_Output, Error>(
                        (abort) => refine(output, abort)
                    ).__extract_data(
                        ($) => {
                            __handle_command_block(parametrized_command_block($)).__start(
                                on_success,
                                on_error
                            )
                        },
                        on_error
                    )
                },
                on_error
            )
        }
    })
}

export const query_stacked = <Error, Staging_Output, Parent_Data>(
    query_result: Query_Result<Staging_Output, Error>,
    parent_data: Parent_Data,
    parametrized_command_block: ($v: Staging_Output, $parent: Parent_Data) => Command_Block<Error>,
): _pi.Command_Promise<Error> => {
    return __command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            query_result.__extract_data(
                (output) => {
                    __handle_command_block(parametrized_command_block(output, parent_data)).__start(
                        on_success,
                        on_error,
                    )
                },
                on_error
            )
        }
    })
}


export const refine_without_error_transformation = <Error, Staging_Output>( //I doubt that this one is needed. Either parameters are refined or query results.. parameters should already be refined. 
    //the only place where parameters are currently refine is in the main functions. can this be solved by adding a refiner to the main function?
    callback: (abort: _pi.Abort<Error>) => Staging_Output,
    parametrized_command_block: ($v: Staging_Output) => Command_Block<Error>,
): _pi.Command_Promise<Error> => {
    return __command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            create_refinement_context(callback).__extract_data(
                (output) => {
                    __handle_command_block(parametrized_command_block(output)).__start(
                        on_success,
                        on_error,
                    )
                },
                on_error
            )
        }
    })
}

export const refine_stacked = <Error, Staging_Output, Parent_Data>(
    callback: (abort: _pi.Abort<Error>) => Staging_Output,
    parent_data: Parent_Data,
    parametrized_command_block: ($v: Staging_Output, $parent: Parent_Data) => Command_Block<Error>,
): _pi.Command_Promise<Error> => {
    return __command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            create_refinement_context(callback).__extract_data(
                (output) => {
                    __handle_command_block(parametrized_command_block(output, parent_data)).__start(
                        on_success,
                        on_error,
                    )
                },
                on_error
            )
        }
    })
}




export namespace if_ {



    export const direct = <Error>(
        precondition: boolean,
        command_block: Command_Block<Error>,
        else_command_block?: Command_Block<Error>,
    ): _pi.Command_Promise<Error> => {
        return __command_promise({
            'execute': (on_success, on_error) => {
                if (precondition) {
                    __handle_command_block(command_block).__start(
                        on_success,
                        on_error
                    )
                } else {
                    if (else_command_block !== undefined) {
                        __handle_command_block(else_command_block).__start(
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

    export const query = <Error>(
        precondition: Query_Result<boolean, Error>,
        command_block: Command_Block<Error>,
        else_command_block?: Command_Block<Error>,
    ): _pi.Command_Promise<Error> => {
        return __command_promise({
            'execute': (on_success, on_error) => {
                precondition.__extract_data(
                    ($) => {
                        if ($) {
                            __handle_command_block(command_block).__start(
                                on_success,
                                on_error
                            )
                        } else {
                            if (else_command_block !== undefined) {
                                __handle_command_block(else_command_block).__start(
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



    export const on_successfully_executed = <Target_Error, Block_Error>(
        command_block: Command_Block<Block_Error>,
        if_true: () => Command_Block<Target_Error>,
        if_false: ($v: Block_Error) => Command_Block<Target_Error>,
    ): _pi.Command_Promise<Target_Error> => {
        return __command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {
                __handle_command_block(command_block).__start(
                    () => {
                        __handle_command_block(if_true()).__start(
                            on_success,
                            on_error,
                        )
                    },
                    (e) => {
                        __handle_command_block(if_false(e)).__start(
                            on_success,
                            on_error,
                        )
                    }
                )
            }
        })
    }




}

export const pseudo_query_successfully_executed = <Target_Error, Block_Error>(
    command_block: Command_Block<Block_Error>,
    on_result: ($: boolean) => Command_Block<Target_Error>,
): _pi.Command_Promise<Target_Error> => {
    return __command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {
            __handle_command_block(command_block).__start(
                () => {
                    __handle_command_block(on_result(true)).__start(
                        on_success,
                        on_error,
                    )
                },
                (e) => {
                    __handle_command_block(on_result(false)).__start(
                        on_success,
                        on_error,
                    )
                }
            )
        }
    })
}


export namespace assert {
    export const direct = <Error>(
        assertion: boolean,
        error_if_failed: Error,
    ): _pi.Command_Promise<Error> => {
        return __command_promise({
            'execute': (on_success, on_error) => {
                if (!assertion) {
                    on_error(error_if_failed)
                    return
                }
                on_success()
            }
        })
    }

    export const query = <Error>(
        assertion: Query_Result<boolean, Error>,
        error_if_failed: Error,
    ): _pi.Command_Promise<Error> => {
        return __command_promise({
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
