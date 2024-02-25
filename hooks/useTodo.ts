import { TodoStatus } from "@/services/models"
import { todoStore } from "@/stores"
import { useEffect, useMemo, useRef, useState } from "react"
import { shallow } from "zustand/shallow"

export const useTodo = () => {
  const { 
    fetchNext,
    todoList,
    fetchNewStatus,
    getTodoGroup,
    currentStatus,
    deleteOne,
    connection,
    pagination,
  } = todoStore(state => ({
    fetchNext: state.fetchNext,
    todoList: state.todoList,
    fetchNewStatus: state.fetchNewStatus,
    getTodoGroup: state.getTodoGroup,
    currentStatus: state.currentStatus,
    deleteOne: state.deleteOne,
    connection: state.connection,
    pagination: state.pagination,
  }), shallow)

  const [deleteId, setDeleteId] = useState('')
  const modalState = useState(false)
  const [fetchBuffer, setFetchBuffer] = useState(false)
  const observerTarget = useRef(null);
  
  const groupTodo = useMemo(() => getTodoGroup(), [todoList])

  const onChangeStatus = (status: TodoStatus) => {
    if (status === currentStatus) {
      return
    }
    fetchNewStatus(status)
  }

  const onDelete = () => {
    deleteOne(deleteId)
  }

  useEffect(() => {
    fetchNext()
  }, [])

  useEffect(() => {
    if (fetchBuffer) {
      setFetchBuffer(false)
      fetchNext()
    }
  }, [pagination.page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const isFetchingPageOne = connection.loading && pagination.page === 1

        if (entries[0].isIntersecting && !connection.loading && pagination.canFetchNext) {
          fetchNext()
        }

        if (isFetchingPageOne && entries[0].isIntersecting) {
          console.log('should fetch more')
          setFetchBuffer(true)
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, pagination, connection]);

  return { currentStatus, groupTodo, onChangeStatus, setDeleteId, modalState, onDelete, observerTarget, connection }
}