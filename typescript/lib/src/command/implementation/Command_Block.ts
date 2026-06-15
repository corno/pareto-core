import { Command_Promise } from "../interface/Command_Promise"

export type Command_Block<Error> = Command_Promise<Error>[]

// export type Parametrized_Command_Block<Error, Parameter> = ($: Parameter) => Command_Block<Error>