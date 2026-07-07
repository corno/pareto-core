import { type Command } from './command.js'
import { type Query } from './query.js'

export type Resource = {
    'commands': { [key:string]: Command<any, any> },
    'queries': { [key:string]: Query<any, any, any> },
}