import * as _pi from "../interface"

import { iterate } from "../__internals/sync/expression/special"

import { __command_promise } from "./command_promise"
import { __handle_command_block } from "./handle_command_block"
import { Command_Block } from "./Command_Block"
import { create_refinement_context } from "../__internals/async/create_refinement_context"
import { create_asynchronous_dictionary_builder } from "../__internals/async/asynchronous_collection_builder"
import { create_asynchronous_processes_monitor } from "../__internals/async/create_asynchronous_processes_monitor"


export namespace listx {

    // export const deprecated_parallel = <Error, Element_Error>(
    //     the_array: _pi.List<_pi.Command_Promise<Element_Error>>,
    //     errors_aggregator: _pi.Transformer<_pi.List<Element_Error>, Error>,
    // ): _pi.Command_Promise<Error> => {
    //     return __command_promise({
    //         'execute': (
    //             on_success,
    //             on_error,
    //         ) => {

    //             const errors_builder = _pinternals.create_asynchronous_list_builder<Element_Error>()

    //             _pinternals.create_asynchronous_processes_monitor(
    //                 (monitor) => {
    //                     the_array.__d_map(($) => {
    //                         monitor['report process started']()

    //                         $.__start(
    //                             () => {
    //                                 monitor['report process finished']()
    //                             },
    //                             (e) => {
    //                                 errors_builder['add item'](e)
    //                                 monitor['report process finished']()
    //                             }
    //                         )
    //                     })
    //                 },
    //                 () => {
    //                     const errors = errors_builder['get list']()
    //                     if (errors.is_empty()) {
    //                         on_success()
    //                     } else {
    //                         on_error(errors_aggregator(errors))
    //                     }
    //                 }
    //             )
    //         }
    //     })
    // }

    export const serie = <Error>(
        array: _pi.List<_pi.Command_Promise<Error>>,
    ): _pi.Command_Promise<Error> => {
        return __command_promise({
            'execute': (on_success, on_error) => {
                iterate(array, (iterator) => {
                    const do_next = () => {
                        const next = iterator.look()
                        if (next !== null) {
                            iterator.consume(
                                ($) => $,
                                () => {
                                    throw new Error("not reachable")
                                },
                            ).__start(
                                () => {
                                    do_next()
                                },
                                on_error
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
        parametrized_command_block: (value: T, key: string) => Command_Block<Entry_Error>,
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
                        dictionary.__d_map(($, key) => {
                            monitor['report process started']()

                            __handle_command_block(parametrized_command_block($, key)).__start(
                                () => {
                                    monitor['report process finished']()
                                },
                                (e) => {
                                    errors_builder['add entry'](key, e)
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
            query_result: _pi.Query_Result<_pi.Dictionary<T>, Error>,
            parametrized_command_block: (value: T, key: string) => Command_Block<Entry_Error>,
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
                                    dictionary.__d_map(($, key) => {
                                        monitor['report process started']()

                                        __handle_command_block(parametrized_command_block($, key)).__start(
                                            () => {
                                                monitor['report process finished']()
                                            },
                                            (e) => {
                                                errors_builder['add entry'](key, e)
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

export const create_error_handling_context = <Target_Error, Block_Error>(
    command_block: Command_Block<Block_Error>,
    parametrized_command_block: ($v: Block_Error) => Command_Block<Target_Error>,
    new_error: Target_Error,
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
                            on_error(new_error)
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
    query_result: _pi.Query_Result<Query_Output, Error>,
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
    query_result: _pi.Query_Result<Staging_Output, Error>,
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
        precondition: _pi.Query_Result<boolean, Error>,
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
        assertion: _pi.Query_Result<boolean, Error>,
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
