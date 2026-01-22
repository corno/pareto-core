import * as _pi from  "../interface"

/**
 * these functions coming from core-internals should be exposed for command development
 */
export { deprecated_cc } from "../__internals/sync/expression/special"

export * from "../__internals/sync/expression/decide" //for handling instructions
export * from "../__internals/sync/extracts/literal"
export * from "./command_procedure"
export * from "./command_promise"
export * from "./command"
export * from "./statement"