import * as p_di from "../../../interface/data"
import { type Command_Promise } from "../../../interface/command/__internal/Command_Promise"


/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_value or on_error callback will be called
 * @param on_value the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<E> = {
    'execute': (
        on_success: () => undefined,
        on_error: ($: E) => undefined,
    ) => undefined
}

class Command_Promise_Class<E extends p_di.Value> implements Command_Promise<E> {
    private executer: Executer<E>
    constructor(executer: Executer<E>) {
        this.executer = executer
    }

    __start(
        on_success: () => undefined,
        on_error: ($: E) => undefined,
    ): undefined {
        this.executer.execute(on_success, on_error)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export default function command_promise<E extends p_di.Value>(
    executer: Executer<E>,
): Command_Promise<E> {
    return new Command_Promise_Class<E>(executer)

}