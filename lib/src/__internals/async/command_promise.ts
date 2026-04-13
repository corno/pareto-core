import * as _pi from  "../../interface"


/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_value or on_error callback will be called
 * @param on_value the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<E> = {
    'execute': (
        on_success: () => void,
        on_error: ($: E) => void,
    ) => void
}

class Command_Promise_Class<E> implements _pi.Command_Promise<E> {
    private executer: Executer<E>
    constructor(executer: Executer<E>) {
        this.executer = executer
    }

    __start(
        on_success: () => void,
        on_error: ($: E) => void,
    ): void {
        this.executer.execute(on_success, on_error)
    }

    map_error<NE>(
        handle_error: (error: E) => NE
    ): _pi.Command_Promise<NE> {
        return new Command_Promise_Class<NE>({
            'execute': (on_success, on_error) => {
                this.executer.execute(
                    on_success,
                    (error) => {
                        on_error(handle_error(error))
                    }
                )
            }
        })
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function __command_promise<E>(
    executer: Executer<E>,
): _pi.Command_Promise<E> {
    return new Command_Promise_Class<E>(executer)

}