import HttpClient from '@/services/http.client'
import { Connection, Pagination, Todo, TodoStatus } from '@/services/models'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'

export interface TodoState {
  currentStatus: TodoStatus
  todoList: Todo[]
  pagination: Pagination
  isLoading: boolean
  error: string
  getTodoGroup: () => Record<string, Todo[]>
  fetchNewStatus: (status: TodoStatus) => Promise<void>
  fetchNext: () => Promise<void>
  deleteOne: (id: string) => void
}

export const todoStore = createWithEqualityFn<TodoState>()(
  devtools(
    (set, get) => ({
      currentStatus: 'TODO',
      todoList: [],
      isLoading: false,
      error: '',
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
          isLoading: false,
          error: '', 
          todoList: [], 
          currentStatus: status,
        })
        const { fetchNext } = get()
        await fetchNext()
      },
      fetchNext: async () => {
        const todoService = HttpClient.instance.todo
        const { currentStatus, pagination, todoList } = get()
        if (!pagination.canFetchNext) {
          return
        }
        const params = pagination.toParams()
        try {
          set({ isLoading: true })
          const { items, total } = await todoService.fetch(currentStatus, { ...params, sortBy: 'createdAt', isAsc: true })
          pagination.page++
          pagination.totalPages = total.totalPages
          set({ todoList: [...todoList, ...items], pagination })
        } catch (error) {
          set({ error: JSON.stringify(error) })
        } finally {
          set({ isLoading: false })
        }
      },
      pagination: new Pagination(),
    }),
    {
      name: 'todo-storage',
    }
  )
)