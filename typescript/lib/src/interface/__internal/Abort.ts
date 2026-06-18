import * as p_di from "../data"

export type Abort<
    Error extends p_di.Value
> = (error: Error) => never
