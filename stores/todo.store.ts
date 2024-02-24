import HttpClient from '@/services/http.client'
import { Connection, Pagination, Todo } from '@/services/models'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

export interface todoState {
  todoList: Todo[]
  fetchNext: () => Promise<void>
  pagination: Pagination
  connection: Connection
}

export const todoStore = createWithEqualityFn<todoState>()(
  devtools(
    (set, get) => ({
      todoList: [],
      fetchNext: async () => {
        const todoService = HttpClient.instance.todo
        const todoList = await todoService.fetch()
        set({ todoList })
      },
      pagination: new Pagination(),
      connection: new Connection(),
    }),
    {
      name: 'todo-storage',
    }
  )
)