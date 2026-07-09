import * as p_di from "../../../interface/data.js"
import command_promise from "./command_promise.js"
import { type Command_Block } from "./Command_Block.js"
import { type Command_Promise } from "../../../interface/__internal/command/Command_Promise.js"

export default function <
Error extends p_di.Value
>(
    block: Command_Block<Error>,
): Command_Promise<Error> {
    return command_promise({
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
                block[index]!.__start(
                    () => {
                        runStep(index + 1)
                    },
                    on_error,
                )
            }
            runStep(0)
        }
    })
}