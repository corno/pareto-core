export declare type IAsync<T> = {
    execute: (callback: (v: T) => void) => void;
};
