import * as p_di from "../../../interface/data/index.js"
import { type Command_Promise } from "../../../interface/command/__internal/Command_Promise.js"

export type Command_Block<Error extends p_di.Value> = Command_Promise<Error>[]
