import { POST } from '@/services'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginTokenData {
  access_token: string
  expires_in: number
}

export function loginApi(data: LoginParams) {
  return POST<LoginTokenData>('/auth/login', data)
}
