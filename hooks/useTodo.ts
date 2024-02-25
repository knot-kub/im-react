import { TodoStatus } from "@/services/models"
import { todoStore } from "@/stores"
import { useEffect, useMemo, useState } from "react"
import { shallow } from "zustand/shallow"

export const useTodo = () => {
  const { fetchNext, todoList, fetchNewStatus, getTodoGroup, currentStatus, deleteOne } = todoStore(state => ({
    fetchNext: state.fetchNext,
    todoList: state.todoList,
    fetchNewStatus: state.fetchNewStatus,
    getTodoGroup: state.getTodoGroup,
    currentStatus: state.currentStatus,
    deleteOne: state.deleteOne,
  }), shallow)

  const [deleteId, setDeleteId] = useState('')
  const modalState = useState(false)
  const groupTodo = useMemo(() => getTodoGroup(), [todoList])
  const onChangeStatus = (status: TodoStatus) => {
    fetchNewStatus(status)
  }

  const onDelete = () => {
    deleteOne(deleteId)
  }

  useEffect(() => {
    fetchNext()
  }, [])

  return { currentStatus, groupTodo, onChangeStatus, setDeleteId, modalState, onDelete }
}