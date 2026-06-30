import type { RouteObject } from 'react-router'
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

import { ProtectedRoute } from '@/components/protected-route'
import RootLayout from '@/layouts/root'

import ErrorBoundary from '../error-boundary'
import { LazyLoad, loader, routes } from './utils'

const router: RouteObject[] = [
  {
    path: '/',
    loader,
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" />, // 重定向
      },
      {
        path: '/home',
        element: <ProtectedRoute>{LazyLoad(lazy(() => import('@/views/home')))}</ProtectedRoute>,
      },
      {
        path: '/mine',
        element: <ProtectedRoute>{LazyLoad(lazy(() => import('@/views/mine')))}</ProtectedRoute>,
      },
      {
        path: '/login',
        element: LazyLoad(lazy(() => import('@/views/login'))),
      },
      {
        path: '/404',
        element: LazyLoad(lazy(() => import('@/components/not-fount'))),
      },
      ...routes, // modules 路由
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" />, // 找不到页面
  },
]

const AppRouter = createBrowserRouter(router)

export default AppRouter
