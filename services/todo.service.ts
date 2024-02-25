import { AxiosInstance } from "axios";
import { BaseService, BasicParams } from "./base.service";
import { Todo, TodoStatus } from "./models/todo.model";

export class TodoService extends BaseService {
  constructor(private readonly axios: AxiosInstance) {
    super()
  }
  
  public async fetch(status: TodoStatus, params: BasicParams): Promise<{items: Todo[], total: { pageNumber: number; totalPages: number }}> {
    const response = await this.axios.get('/todo-list', { params: { ...params, status }})
    return { 
      items: this.handleListResponse(Todo, response.data?.tasks || []),
      total: { 
        pageNumber: response.data?.pageNumber || 1, 
        totalPages: response.data?.totalPages || 0,
      },
    }
  }
}