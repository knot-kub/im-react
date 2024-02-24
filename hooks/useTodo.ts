import { todoStore } from "@/stores"
import { useEffect } from "react"
import { shallow } from "zustand/shallow"

export const useTodo = () => {
  const { fetchNext, todoList } = todoStore(state => ({
    fetchNext: state.fetchNext,
    todoList: state.todoList,
  }), shallow)

  useEffect(() => {
    console.log('Hi todo hook')
    fetchNext()
  }, [])

  useEffect(() => {
    console.log('todoList :', todoList)
  }, [todoList])
}