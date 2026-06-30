import { create } from 'zustand'

import { getAppUserMe } from '@/api/app'
import { loginApi } from '@/api/auth'
import { TOKEN_STORAGE_KEY } from '@/constants/auth'

interface SessionUser {
  name: string
  role: string
  phone: string
}

interface LoginPayload {
  username: string
  password: string
}

interface AuthState {
  token: string
  user: SessionUser
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

function readToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || ''
}

function persistSession(token: string, username: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
  return {
    token,
    isAuthenticated: true,
    user: {
      name: username,
      role: '用户',
      phone: '',
    },
  }
}

function getErrorMessage(res: IResponse | undefined, fallback: string) {
  return res?.msg || res?.message || fallback
}

function isDemoAccount(username: string, password: string) {
  return import.meta.env.DEV && username === 'admin' && password === 'admin123'
}

const initialToken = readToken()

export const useAuthStore = create<AuthState>(set => ({
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  user: {
    name: '用户',
    role: '用户',
    phone: '',
  },
  login: async ({ username, password }) => {
    if (isDemoAccount(username, password)) {
      set(persistSession(`demo.${crypto.randomUUID()}`, username))
      return
    }

    const res = await loginApi({ username, password })
    if (res?.code === 200 && res.data?.access_token) {
      const token = res.data.access_token
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token)

      const profileRes = await getAppUserMe()
      if (profileRes?.code === 200 && profileRes.data) {
        set({
          token,
          isAuthenticated: true,
          user: {
            name: profileRes.data.nickName || profileRes.data.username || username,
            role: '用户',
            phone: profileRes.data.phone || '',
          },
        })
        return
      }

      set(persistSession(token, username))
      return
    }

    throw new Error(getErrorMessage(res, '登录失败，请检查账号或密码'))
  },
  logout: () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    set({
      token: '',
      isAuthenticated: false,
      user: {
        name: '用户',
        role: '用户',
        phone: '',
      },
    })
  },
}))
