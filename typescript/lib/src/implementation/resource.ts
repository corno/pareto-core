import * as p_iq from "../interface/query.js"
import * as p_ic from "../interface/command.js"
import * as p_id from "../interface/data.js"

import p_query from "./__internal/query/query_action.js"
import p_query_result from "./__internal/query/query_result.js"

import p_command from "./__internal/command/command_action.js"
import p_command_promise from "./__internal/command/command_promise.js"

import { type Query_Action } from "../interface/__internal/query/Query_Action.js"
import { type Command_Action } from "../interface/__internal/command/Command_Action.js"

export * as literal from "./__internal/sync/literal.js"

export const query = <
    Result extends p_id.Value,
    Error extends p_id.Value,
    Dynamic_Parameter extends p_id.Value
>(
    callback: (
        $d: Dynamic_Parameter,
        on_result: ($: Result) => undefined,
        on_error: ($: Error) => undefined
    ) => undefined
): Query_Action<Result, Error, Dynamic_Parameter> => {
    return p_query(($) => p_query_result((on_result, on_error) => {
        callback($, on_result, on_error)
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
): Command_Action<Error, Parameter> => {
    return p_command(($p) => p_command_promise({
        'execute': (on_success, on_error) => {
            callback($p, on_success, on_error)
        }
    }))
}