import * as p_di from "../data/index.js"

export type Abort<
    Error extends p_di.Value
> = (error: Error) => never
