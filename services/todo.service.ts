import { AxiosInstance } from "axios";
import { BaseService } from "./base.service";
import { Todo } from "./models/todo.model";

export class TodoService extends BaseService {
  constructor(private readonly axios: AxiosInstance) {
    super()
  }
  
  public async fetch(): Promise<Todo[]> {
    const response = await this.axios.get('/todo-list')
    return this.handleListResponse(Todo, response.data?.tasks || [])
  }
}