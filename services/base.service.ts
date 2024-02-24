export class BaseService {
  protected handleResponse<T>(json: any): T {
    return json as T
  }
}