export type Constructor<Target_Value> = () => Target_Value

export type Transformer_With_Source_Value<Target_Value, Source_Value> = (
    $: Source_Value,
) => Target_Value

export type Transformer_With_Source_Value_With_Constructors<
    Target_Value,
    Source_Value,
    Constructors,
> = ($: Source_Value, $constructors: Constructors) => Target_Value

export type Transformer_With_Source_Value_With_Directive<
    Target_Value,
    Source_Value,
    Directive,
> = ($: Source_Value, $p: Directive) => Target_Value

export type Transformer_With_Source_Value_With_Directive_With_Constructors<
    Target_Value,
    Source_Value,
    Directive,
    Constructors,
> = (
    $: Source_Value,
    $p: Directive,
    $constructors: Constructors,
) => Target_Value

export type Transformer_With_Source_Value_With_Values_And_Lookups<
    Target_Value,
    Source_Value,
    Values,
    Lookups,
> = ($: Source_Value, $values: Values, $lookups: Lookups) => Target_Value

export type Transformer_With_Source_Value_With_Values_And_Lookups_With_Constructors<
    Target_Value,
    Source_Value,
    Values,
    Lookups,
    Constructors,
> = (
    $: Source_Value,
    $values: Values,
    $lookups: Lookups,
    $constructors: Constructors,
) => Target_Value

export type Transformer_With_Source_Value_With_Directive_With_Values_And_Lookups<
    Target_Value,
    Source_Value,
    Directive,
    Values,
    Lookups,
> = (
    $: Source_Value,
    $p: Directive,
    $values: Values,
    $lookups: Lookups,
) => Target_Value

export type Transformer_With_Source_Value_With_Directive_With_Values_And_Lookups_With_Constructors<
    Target_Value,
    Source_Value,
    Directive,
    Values,
    Lookups,
    Constructors,
> = (
    $: Source_Value,
    $p: Directive,
    $values: Values,
    $lookups: Lookups,
    $constructors: Constructors,
) => Target_Value

export type Transformer_With_Error_With_Source_Value<
    Target_Value,
    Error,
    Source_Value,
> = ($: Source_Value, abort: (error: Error) => never) => Target_Value

export type Transformer_With_Error_With_Source_Value_With_Constructors<
    Target_Value,
    Error,
    Source_Value,
    Constructors,
> = (
    $: Source_Value,
    abort: (error: Error) => never,
    $constructors: Constructors,
) => Target_Value

export type Transformer_With_Error_With_Source_Value_With_Directive<
    Target_Value,
    Error,
    Source_Value,
    Directive,
> = (
    $: Source_Value,
    abort: (error: Error) => never,
    $p: Directive,
) => Target_Value

export type Transformer_With_Error_With_Source_Value_With_Directive_With_Constructors<
    Target_Value,
    Error,
    Source_Value,
    Directive,
    Constructors,
> = (
    $: Source_Value,
    abort: (error: Error) => never,
    $p: Directive,
    $constructors: Constructors,
) => Target_Value

export type Transformer_With_Error_With_Source_Value_With_Values_And_Lookups<
    Target_Value,
    Error,
    Source_Value,
    Values,
    Lookups,
> = (
    $: Source_Value,
    abort: (error: Error) => never,
    $values: Values,
    $lookups: Lookups,
) => Target_Value

export type Transformer_With_Error_With_Source_Value_With_Values_And_Lookups_With_Constructors<
    Target_Value,
    Error,
    Source_Value,
    Values,
    Lookups,
    Constructors,
> = (
    $: Source_Value,
    abort: (error: Error) => never,
    $values: Values,
    $lookups: Lookups,
    $constructors: Constructors,
) => Target_Value

export type Transformer_With_Error_With_Source_Value_With_Directive_With_Values_And_Lookups<
    Target_Value,
    Error,
    Source_Value,
    Directive,
    Values,
    Lookups,
> = (
    $: Source_Value,
    abort: (error: Error) => never,
    $p: Directive,
    $values: Values,
    $lookups: Lookups,
) => Target_Value

export type Transformer_With_Error_With_Source_Value_With_Directive_With_Values_And_Lookups_With_Constructors<
    Target_Value,
    Error,
    Source_Value,
    Directive,
    Values,
    Lookups,
    Constructors,
> = (
    $: Source_Value,
    abort: (error: Error) => never,
    $p: Directive,
    $values: Values,
    $lookups: Lookups,
    $constructors: Constructors,
) => Target_Value

export type Production_With_Source_Value<Target_Value, Source_Value> = (
    $: Source_Value,
) => Target_Value
