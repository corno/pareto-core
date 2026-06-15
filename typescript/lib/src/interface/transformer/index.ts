
export type Transformer<Input, Result> = (
    $: Input,
) => Result

export type Transformer_With_Parameter<Input, Result, Parameter> = (
    $: Input,
    $p: Parameter,
) => Result
