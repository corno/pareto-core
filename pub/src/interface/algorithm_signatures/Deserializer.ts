import {
    Refiner,
    Refiner_With_Parameters,
    Refiner_Without_Error,
    Refiner_Without_Error_With_Parameters,
} from "./Refiner"

export type Deserializer<Result, Error> = Refiner<Result, Error, string>
export type Deserializer_With_Parameters<Result, Error, Parameters> = Refiner_With_Parameters<Result, Error, string, Parameters>
export type Deserializer_Without_Error<Result> = Refiner_Without_Error<Result, string>
export type Deserializer_Without_Error_With_Parameters<Result, Parameters> = Refiner_Without_Error_With_Parameters<Result, string, Parameters>

export type Number_Deserializer<Error> = Deserializer<number, Error>
export type Number_Deserializer_With_Parameters<Error, Parameters> = Deserializer_With_Parameters<number, Error, Parameters>
export type Number_Deserializer_Without_Error = Deserializer_Without_Error<number>
export type Number_Deserializer_Without_Error_With_Parameters<Parameters> = Deserializer_Without_Error_With_Parameters<number, Parameters>

export type Boolean_Deserializer<Error> = Deserializer<boolean, Error>
export type Boolean_Deserializer_With_Parameters<Error, Parameters> = Deserializer_With_Parameters<boolean, Error, Parameters>
export type Boolean_Deserializer_Without_Error = Deserializer_Without_Error<boolean>
export type Boolean_Deserializer_Without_Error_With_Parameters<Parameters> = Deserializer_Without_Error_With_Parameters<boolean, Parameters>

export type Text_Deserializer<Error> = Deserializer<string, Error>
export type Text_Deserializer_With_Parameters<Error, Parameters> = Deserializer_With_Parameters<string, Error, Parameters>
export type Text_Deserializer_Without_Error = Deserializer_Without_Error<string>
export type Text_Deserializer_Without_Error_With_Parameters<Parameters> = Deserializer_Without_Error_With_Parameters<string, Parameters>