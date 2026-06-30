import { GET } from '@/services'

/** App 端公开健康检查：GET /app/public/health */
export function getAppHealth() {
  return GET<{ status: string }>('/app/public/health')
}

/** App 端当前用户：GET /app/user/me（需登录） */
export function getAppUserMe() {
  return GET<{
    userId: number
    username: string
    nickName?: string
    avatar?: string
    email?: string
    phone?: string
  }>('/app/user/me')
}
