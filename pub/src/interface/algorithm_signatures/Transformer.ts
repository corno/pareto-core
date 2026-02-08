
export type Transformer_With_Parameter<Input, Result, Parameter> = (
    $: Input,
    $p: Parameter,
) => Result

export type Transformer<Input, Result> = (
    $: Input,
) => Result

