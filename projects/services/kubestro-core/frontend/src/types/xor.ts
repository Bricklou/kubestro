/**
 * XOR type utility that makes object types mutually exclusive
 *
 * Handles nested distribution correctly for union types
 */
export type XOR<T, U> =
  | (T & { [P in keyof U]?: never })
  | (U & { [P in keyof T]?: never })
