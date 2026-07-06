import * as p_di from "../../../interface/data.js"
import { type Command_Promise } from "../../../interface/__internal/command/Command_Promise.js"

export type Command_Block<Error extends p_di.Value> = Command_Promise<Error>[]
