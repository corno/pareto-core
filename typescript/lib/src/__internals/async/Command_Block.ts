import * as _pci from  "../../command/interface"

export type Command_Block<Error> = _pci.Command_Promise<Error>[]

// export type Parametrized_Command_Block<Error, Parameter> = ($: Parameter) => Command_Block<Error>