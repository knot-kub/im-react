import { deserialize } from 'serializr'

export interface BasicParams {
  offset?: number
  limit?: number
  sortBy?: string
  isAsc?: boolean
}

export class BaseService {
  protected handleResponse<T>(c: new () => T, json: any): T {
    return deserialize(c, json)
  }

  protected handleListResponse<T>(c: new () => T, json: any[]): T[] {
    return json.map((j) => deserialize(c, j))
  }
}