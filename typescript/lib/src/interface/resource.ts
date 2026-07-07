import { type Command } from './command.js'
import { type Query } from './query.js'

export type Resource = {
    'commands': Record<string, Command<any, any>>,
    'queries': Record<string, Query<any, any, any>>,
}