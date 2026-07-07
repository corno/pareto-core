import * as p_iq from "../interface/query.js"
import * as p_ic from "../interface/command.js"
import * as p_id from "../interface/data.js"

import p_query from "./__internal/query/query.js"
import p_query_result from "./__internal/query/query_result.js"

import p_command from "./__internal/command/command.js"
import p_command_promise from "./__internal/command/command_promise.js"

export * as literal from "./__internal/sync/literal.js"

export const query = <
    Result extends p_id.Value,
    Error extends p_id.Value,
    Parameter extends p_id.Value
>(
    bla: (
        $: Parameter,
        on_result: ($: Result) => undefined,
        on_error: ($: Error) => undefined
    ) => undefined
): p_iq.Query<Result, Error, Parameter> => {
    return p_query(($) => p_query_result((on_result, on_error) => {
        bla($, on_result, on_error)
    }))
}

export const command = <
    Error extends p_id.Value,
    Parameter extends p_id.Value,
>(
    callback: (
        $: Parameter,
        on_success: () => undefined,
        on_error: ($: Error) => undefined
    ) => undefined
): p_ic.Command<Error, Parameter> => {
    return p_command(($p) => p_command_promise({
        'execute': (on_success, on_error) => {
            callback($p, on_success, on_error)
        }
    }))
}