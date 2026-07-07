import { type Command } from './command.js'
import { type Query } from './query.js'

export type Resource = {
    'commands': Commands,
    'queries': Queries,
}

export type Commands = { [key:string]: Command<any, any> }
export type Queries = { [key:string]: Query<any, any, any> }