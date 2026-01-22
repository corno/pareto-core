import { Query_Result } from "../interfaces"
import { Transformer } from "./Transformer"

export type Query<Output, Error, Input> = <Target_Error>(
    $: Input,
    error_transformer: Transformer<Error, Target_Error>,
) => Query_Result<Output, Target_Error>