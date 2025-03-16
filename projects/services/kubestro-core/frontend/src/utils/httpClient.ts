import ky from 'ky'
import type { ParsedQuery } from 'query-string'
import queryString from 'query-string'

export const httpClient = ky.extend({})

export function parseParams(url: URL): ParsedQuery {
  return queryString.parse(url.searchParams.toString(), { arrayFormat: 'bracket', types: {
    order: 'string'
  } })
}
