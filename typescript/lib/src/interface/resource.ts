import { type Command } from './command.js'
import { type Query } from './query.js'

export type Resource<
    Commands extends Record<string, Command<any, any>>,
    Queries extends Record<string, Query<any, any, any>>,
> = {
    'commands': Commands,
    'queries': Queries,
}