import { date, serializable } from "serializr"

export class Todo {
  @serializable
  id!: string

  @serializable
  title!: string

  @serializable
  description!: string

  @serializable
  status!: string

  @serializable(date())
  createdAt!: Date
}