import { authStore, ACCESS_TOKEN_KEY } from "@/stores"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { shallow } from "zustand/shallow"

export const useAuthentication = () => {
  const { verify, login, getProfile, isLoading, error } = authStore(state => ({
    verify: state.verify,
    login: state.login,
    getProfile: state.getProfile,
    isLoading: state.isLoading,
    error: state.error,
  }), shallow)

  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = () => {
    login(username, password)
  }

  useEffect(() => {
    if (getProfile()) {
      router.replace('/')
    }
  }, [localStorage.getItem(ACCESS_TOKEN_KEY)])

  return { setUsername, setPassword, onLogin, isLoading, error }
}