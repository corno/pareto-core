import { type Command_Action } from './command_action.js'
import { type Query_Action } from './query_action.js'

export type Resource = {
    'commands': Commands,
    'queries': Queries,
}

export type Commands = { [key:string]: Command_Action<any, any> }
export type Queries = { [key:string]: Query_Action<any, any, any> }