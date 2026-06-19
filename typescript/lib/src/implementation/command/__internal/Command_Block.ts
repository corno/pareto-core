import * as p_di from "../../../interface/data"
import { Command_Promise } from "../../../interface/command/__internal/Command_Promise"

export type Command_Block<Error extends p_di.Value> = Command_Promise<Error>[]
