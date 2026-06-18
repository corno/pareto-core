import * as p_qi from "../../interface/query"
import * as p_di from "../../interface/data"

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

class Query_Result_Class<
    Output extends p_di.Value,
    Error extends p_di.Value
> implements p_qi.Query_Result<Output, Error> {

    public __extract_data: Executer<Output, Error>
    constructor(executer: Executer<Output, Error>) {
        this.__extract_data = executer
    }
}

export default function query_result<
    T extends p_di.Value,
    E extends p_di.Value
>(
    executer: Executer<T, E>,
): p_qi.Query_Result<T, E> {
    return new Query_Result_Class<T, E>(executer)

}