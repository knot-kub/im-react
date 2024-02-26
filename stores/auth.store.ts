import { Connection } from "@/services/models"
import { devtools } from "zustand/middleware"
import { createWithEqualityFn } from 'zustand/traditional'
import jwt from 'jsonwebtoken'

interface User {
  username: string
  password: string
  name: string
  surname: string
}

const MOCK_USERS: User[] = [
  {
    username: 'test1@gmail.com',
    password: 'password1',
    name: 'name1',
    surname: 'surname1',
  },
  {
    username: 'test2@gmail.com',
    password: 'password2',
    name: 'name2',
    surname: 'surname2',
  }
]

export const ACCESS_TOKEN_KEY = 'accessToken' as const
const PRIVATE_KEY = 'PRIVATE_KEY' as const

export interface AuthState {
  mockUsers: User[]
  isLoading: boolean
  error: string
  getProfile: () => User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  verify: () => object | null
}

export const authStore = createWithEqualityFn<AuthState>()(
  devtools(
    (set, get) => ({
      mockUsers: MOCK_USERS,
      isLoading: false,
      error: '',
      logout: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      },
      login: async (username: string, password: string) => {
        const { mockUsers, isLoading } = get()

        if (isLoading) {
          return
        }
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 500))

        const user = mockUsers.find((u) => u.username === username && u.password === password)
        if (!user) {
          set({ error: 'username or password is incorrect'})
        } else {
          const payload = { username }
          const accessToken = jwt.sign(payload, PRIVATE_KEY, { expiresIn: '1h' })
          set({ error: ''})
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
        }

        set({ isLoading: false })
      },
      verify: () => {
        if (typeof window === 'undefined') {
          return null
        }
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
        if (!accessToken) {
          return null
        }

        try {
          return jwt.verify(accessToken, PRIVATE_KEY) as object
        } catch {
          return null
        }
      },
      getProfile: () => {
        const { verify, mockUsers } = get()
        const payload = verify()
        if (!payload) {
          return null
        }

        const username = (payload as Record<string, any>).username || null
        return mockUsers.find((u) => u.username === username) || null
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)