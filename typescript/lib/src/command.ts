

export * as literal from "./__internal/sync/literal.js"

export * from "./__internal/command/Command_Implementation.js"
export * as s from "./__internal/command/command_statements.js"
export * from "./__internal/command/Command_Block.js"
export * from "./__internal/command/decide.js"


import command from "./__internal/command/Command_Implementation.js"

export {
    command,
}

export * from "./interface/__internal/command/Command_Interface.js"
