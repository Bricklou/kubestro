export interface Paginated<T> {
  items: T[]
  total_items: number
  total_pages: number
}
