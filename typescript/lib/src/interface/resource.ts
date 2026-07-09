import { type Command_Interface } from './command_interface.js'
import { type Query_Interface } from './query_interface.js'

export type Resource = {
    'commands': Commands,
    'queries': Queries,
}

export type Commands = { [key:string]: Command_Interface<any, any> }
export type Queries = { [key:string]: Query_Interface<any, any, any> }