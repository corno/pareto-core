

export * as literal from "./__internal/sync/literal.js"

export * from "./__internal/command/command_implementation.js"
export * as s from "./__internal/command/command_statements.js"
export * from "./__internal/command/Command_Block.js"
export * from "./__internal/command/decide.js"


import command from "./__internal/command/command_implementation.js"

export {
    command,
}