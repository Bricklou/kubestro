import type { JsonValidationError } from './generic-errors'
import type { Prettify } from '~/types/prettify'

// Helper type to extract path string from #/ prefix
type ExtractPath<T extends string> = T extends `#/${infer Path}` ? Path : never

// Helper type to split path into parts
type Split<T extends string> = T extends `${infer First}/${infer Rest}`
  ? [First, ...Split<Rest>]
  : [T]

// Helper type to convert string tuple to nested object type
type TupleToNested<T extends string[], V> = T extends [infer First extends string]
  ? Record<First, V>
  : T extends [infer First extends string, ...infer Rest extends string[]]
    ? { [K in First]: TupleToNested<Rest, V> }
    : never

// Helper type to convert union to intersection
type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends ((k: infer I) => void) ? I : never

// Main type to convert flat paths to nested structure
type PathsToNested<T extends Record<string, JsonValidationError>> = UnionToIntersection<
  {
    [K in keyof T]: TupleToNested<Split<ExtractPath<K & string>>, T[K]>
  }[keyof T]
>

// Helper function to merge objects deeply with proper typing
function deepMerge<T extends JsonValidationError>(
  target: NestedObject<T>,
  source: NestedObject<T>
): NestedObject<T> {
  const result = { ...target }

  for (const key of Object.keys(source)) {
    const targetValue = result[key]
    const sourceValue = source[key]

    if (
      typeof targetValue === 'object' &&
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue) &&
      !('code' in sourceValue) &&
      !('code' in targetValue)
    ) {
      result[key] = deepMerge(
        targetValue,
        sourceValue
      )
    }
    else {
      result[key] = sourceValue
    }
  }

  return result
}

// Type for nested object structure
interface NestedObject<T> {
  [key: string]: T | NestedObject<T>
}
// Type-Safe helper to build nested object from path parts
function buildNestedObject<T extends JsonValidationError>(
  pathParts: string[],
  value: T
): NestedObject<T> {
  if (pathParts.length === 1) {
    return {
      [pathParts[0]]: value
    }
  }

  const [first, ...rest] = pathParts
  return {
    [first]: buildNestedObject(rest, value)
  }
}

export function transformErrors<Input extends Record<`#/${string}`, JsonValidationError>>(
  input: Input
): Prettify<PathsToNested<Input>> {
  // Initialize an empty object of the correct shape
  let result: NestedObject<JsonValidationError> = {}

  for (const [path, error] of Object.entries(input)) {
    const cleanedPath = path.replace('#/', '')
    const pathParts = cleanedPath.split('/')

    const nested = buildNestedObject(pathParts, error)
    result = deepMerge(result, nested)
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I'm confident in the result
  return result as PathsToNested<Input>
}
