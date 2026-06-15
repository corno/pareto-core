import * as p_ci from  "../interface"

export type Command_Block<Error> = p_ci.Command_Promise<Error>[]

// export type Parametrized_Command_Block<Error, Parameter> = ($: Parameter) => Command_Block<Error>