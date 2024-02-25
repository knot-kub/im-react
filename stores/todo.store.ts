import HttpClient from '@/services/http.client'
import { Connection, Pagination, Todo, TodoStatus } from '@/services/models'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'

export interface todoState {
  currentStatus: TodoStatus
  todoList: Todo[]
  pagination: Pagination
  connection: Connection
  getTodoGroup: () => Record<string, Todo[]>
  fetchNewStatus: (status: TodoStatus) => Promise<void>
  fetchNext: () => Promise<void>
  deleteOne: (id: string) => void
}

export const todoStore = createWithEqualityFn<todoState>()(
  devtools(
    (set, get) => ({
      currentStatus: 'TODO',
      todoList: [],
      deleteOne: (id: string) => {
        const { todoList } = get()
        set({ todoList: todoList.filter((todo) => todo.id !== id) })
      },
      getTodoGroup: () => {
        const { todoList } = get()
        let groupTodoList = groupBy(todoList, (todo) => {
          const today = DateTime.fromJSDate(new Date()).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          const createdAt = DateTime.fromJSDate(todo.createdAt).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          const { days } = createdAt.diff(today, ['day'])
          switch (days) {
            case 0:
              return 'Today'
            case 1:
              return 'Tomorrow'
            case -1:
              return 'Yesterday'
            default:
              return createdAt.toFormat('dd LLL yyyy')
          }
        })
        for (const [name, todoList] of Object.entries(groupTodoList)) {
          groupTodoList[name] = todoList.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()))
        }
        return groupTodoList
      },
      fetchNewStatus: async (status: TodoStatus) => {
        set({ 
          pagination: new Pagination(), 
          connection: new Connection(), 
          todoList: [], 
          currentStatus: status,
        })
        const { fetchNext } = get()
        await fetchNext()
      },
      fetchNext: async () => {
        const todoService = HttpClient.instance.todo
        const { currentStatus, pagination, connection, todoList } = get()
        if (!pagination.canFetchNext) {
          return
        }
        const params = pagination.toParams()
        try {
          connection.loading = true
          set({ connection: connection })
          const { items, total } = await todoService.fetch(currentStatus, { ...params, sortBy: 'createdAt', isAsc: true })
          pagination.page++
          pagination.totalPages = total.totalPages
          set({ todoList: [...todoList, ...items], pagination })
        } catch (error) {
          connection.error = JSON.stringify(error)
          set({ connection: connection })
        } finally {
          connection.loading = false
          set({ connection: connection })
        }
      },
      pagination: new Pagination(),
      connection: new Connection(),
    }),
    {
      name: 'todo-storage',
    }
  )
)