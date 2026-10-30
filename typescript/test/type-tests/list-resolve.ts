import * as transformer from '../../lib/dist/transformer.js'
import * as refiner from '../../lib/dist/refiner.js'
import type * as schema from '../../lib/dist/schema.js'

const input = transformer.literal.list([1, 2])

for (const api of [transformer.from, transformer.convert, refiner.from, refiner.convert]) {
    const resolved: schema.List<{ readonly sum: number }> = api.list(input).resolve(
        (item, preceding: schema.Optional_Value<{ readonly sum: number }>) => {
            const number: number = item
            const raw = preceding.__get_raw()
            return {sum: number + (raw === null ? 0 : raw[0].sum)}
        },
    )
    const inferred: schema.List<string> = api.list(input).resolve(item => String(item))
    const nulls: schema.List<null> = api.list(input).resolve(() => null)
    const optionals: schema.List<schema.Optional_Value<number>> =
        api.list(input).resolve(() => transformer.literal.not_set<number>())
    // @ts-expect-error The preceding result must match the callback result type.
    api.list(input).resolve<string>((item, preceding: schema.Optional_Value<number>) => String(item))
    void resolved
    void inferred
    void nulls
    void optionals
}
