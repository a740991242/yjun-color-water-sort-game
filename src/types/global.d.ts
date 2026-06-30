declare interface IResponse<T = unknown> {
  code: number
  message?: string
  msg?: string
  data: T
}

declare module 'postcss-pxtorem';
