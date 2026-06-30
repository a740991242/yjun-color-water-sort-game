import type { AxiosRequestConfig } from 'axios'

import axiosInstance from './service'

/** 根据 axiosInstance 配置看情况修改 */
export function GET<T = unknown, P = Record<string, unknown>>(url: string, params?: P, config?: AxiosRequestConfig): Promise<IResponse<T>> {
  return axiosInstance({
    method: 'GET',
    url,
    params,
    ...config,
  }).then(res => res.data as IResponse<T>)
}

export function POST<T = unknown, P = object>(url: string, data?: P, config?: AxiosRequestConfig): Promise<IResponse<T>> {
  return axiosInstance({
    method: 'POST',
    url,
    data,
    ...config,
  }).then(res => res.data as IResponse<T>)
}
