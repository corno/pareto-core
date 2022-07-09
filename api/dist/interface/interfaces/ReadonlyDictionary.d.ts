import { IReadonlyLookup } from "./ReadonlyLookup";
export declare type TKeyValueTuple<T> = {
    key: string;
    value: T;
};
export declare type IReadonlyDictionary<T> = {
    readonly "getLookup": () => IReadonlyLookup<T>;
    readonly "find": <RT>(key: string, ifFound: (entry: T) => RT, ifNotFound: (keys: string[]) => RT) => RT;
    readonly "map": <NT>(cb: (v: T, key: string) => NT) => IReadonlyDictionary<NT>;
    readonly "toArray": () => TKeyValueTuple<T>[];
};
