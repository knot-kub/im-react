import { date, serializable } from "serializr"

export type TodoStatus = 'TODO' | 'DOING' | 'DONE'

export class Todo {
  @serializable
  id!: string

  @serializable
  title!: string

  @serializable
  description!: string

  @serializable
  status!: TodoStatus

  @serializable(date())
  createdAt!: Date
}