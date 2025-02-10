export interface BaseError<S extends number> {
  status: S
  title: string
  detail: string
  code: string
}

export interface JsonValidationError {
  code: string
  detail: string
}

type MakePath<T, Prefix extends string = '#'> = T extends object
  ? { [K in keyof T]: `${Prefix}/${string & K}${MakePath<T[K], ''>}` }[keyof T]
  : ''

export interface ValidationError<T extends object = object> extends BaseError<422> {
  errors: Record<MakePath<T>, JsonValidationError>
}

export type UnauthorizedError = BaseError<401>

export type AllHttpErrors = ValidationError | UnauthorizedError
