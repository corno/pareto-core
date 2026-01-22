import * as _pi from  "../interface"
import { __command_promise } from "./command_promise"
import { Command_Block } from './Command_Block'

export const __handle_command_block = <Error>(
    block: Command_Block<Error>,
): _pi.Command_Promise<Error> => {
    return __command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {

            const length = block.length
            const runStep = (index: number) => {
                if (index >= length) {
                    on_success()
                    return
                }
                block[index].__start(
                    () => runStep(index + 1),
                    on_error,
                )
            }
            runStep(0)
        }
    })
}