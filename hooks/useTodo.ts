import { TodoStatus } from "@/services/models"
import { authStore, todoStore } from "@/stores"
import { useRouter } from "next/navigation"
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
    pagination,
    isLoading,
  } = todoStore(state => ({
    fetchNext: state.fetchNext,
    todoList: state.todoList,
    fetchNewStatus: state.fetchNewStatus,
    getTodoGroup: state.getTodoGroup,
    currentStatus: state.currentStatus,
    deleteOne: state.deleteOne,
    pagination: state.pagination,
    isLoading: state.isLoading,
  }), shallow)

  const { verify, getProfile, logout } = authStore(state => ({
    verify: state.verify,
    getProfile: state.getProfile,
    logout: state.logout,
  }), shallow)

  const router = useRouter()

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
    if (!verify()) {
      router.replace('/login')
    } else {
      fetchNewStatus('TODO')
    }
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
        const isFetchingPageOne = isLoading && pagination.page === 1

        if (entries[0].isIntersecting && !isLoading && pagination.canFetchNext) {
          fetchNext()
        }

        if (isFetchingPageOne && entries[0].isIntersecting) {
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
  }, [observerTarget, pagination, isLoading]);

  const onLogout = () => {
    logout()
    router.replace('/login')
  }

  return { currentStatus, groupTodo, onChangeStatus, setDeleteId, modalState, onDelete, observerTarget, isLoading, getProfile, onLogout }
}