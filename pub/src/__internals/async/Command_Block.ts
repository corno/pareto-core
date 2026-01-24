import * as _pi from  "../../interface"

export type Command_Block<Error> = _pi.Command_Promise<Error>[]

export type Parametrized_Command_Block<Error, Parameter> = ($: Parameter) => Command_Block<Error>