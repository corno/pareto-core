import * as p_ti from "../../interface/transformer"
import * as p_qi from "../../interface/query"
import create_refinement_context from "../__internal/sync/create_refinement_context"
import { Abort } from "../../interface/__internal/Abort"

/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_result or on_error callback will be called
 * @param on_result the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<Output, Error> = (
    on_result: ($: Output) => undefined,
    on_error: ($: Error) => undefined,
) => undefined

class Query_Result_Class<Output, Error> implements p_qi.Query_Result<Output, Error> {

    private executer: Executer<Output, Error>
    constructor(executer: Executer<Output, Error>) {
        this.executer = executer
    }
    
    __extract_data(
        on_result: ($: Output) => undefined,
        on_error: ($: Error) => undefined,
    ): undefined {
        this.executer(on_result, on_error)
    }
}

export default function query_result<T, E>(
    executer: Executer<T, E>,
): p_qi.Query_Result<T, E> {
    return new Query_Result_Class<T, E>(executer)

}