import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

import { Loading } from '@/components'
import { TOKEN_STORAGE_KEY } from '@/constants/auth'

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 请求的默认前缀 只要是发出去请求就会 默认带上这个前缀
  timeout: 10000, // 请求超时时间：10s
  headers: { 'Content-Type': 'application/json' }, // 设置默认请求头
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    Loading.show() // 请求前显示loading
    return config
  },
  (err: AxiosError) => {
    Loading.hide() // 请求结束隐藏loading
    return Promise.reject(err)
  },
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    Loading.hide()
    return res
  },
  (err: AxiosError<IResponse>) => {
    Loading.hide()
    const message = err.response?.data?.msg ?? err.message ?? '网络异常，请稍后重试'
    return Promise.reject(new Error(message))
  },
)

/** 解析http层面请求异常原因 */
// function onErrorReason(message: string): string {
//   if (message.includes('Network Error')) {
//     return '网络异常，请检查网络情况!';
//   }
//   if (message.includes('timeout')) {
//     return '请求超时，请重试!';
//   }
//   return '服务异常,请重试!';
// }

// 导出实例
export default axiosInstance
