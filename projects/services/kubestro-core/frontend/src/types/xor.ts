/**
 * XOR type utility that makes object types mutually exclusive
 *
 * Handles nested distribution correctly for union types
 */
/*
 * Type Without<T, U> = Partial<Record<Exclude<keyof T, keyof U>, never>>
 * export type XOR<T, U> = (T | U) extends object ?
 *   Prettify<(Without<T, U> & U)> | Prettify<(Without<U, T> & T)> :
 *   T | U
 */
export type XOR<T, U> =
  | (T & { [P in keyof U]?: never })
  | (U & { [P in keyof T]?: never })
