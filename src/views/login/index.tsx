import { Button, Form, Input, Toast } from 'antd-mobile'
import { useState } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router'

import { useRouter } from '@/hooks'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store'

import './index.scss'

interface LoginFormValues {
  username: string
  password: string
}

function resolveRedirectPath(callback: string | null, from?: string) {
  if (from && from !== '/login')
    return from

  if (!callback)
    return '/home'

  try {
    const pathname = new URL(callback, window.location.origin).pathname
    return pathname === '/login' ? '/home' : pathname
  }
  catch {
    return '/home'
  }
}

function Login() {
  const { t } = useI18n()
  const router = useRouter()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const login = useAuthStore(state => state.login)

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  const onFinish = async (values: LoginFormValues) => {
    setSubmitting(true)
    try {
      await login(values)
      Toast.show({ icon: 'success', content: t('auth.loginSuccess') })
      const from = (location.state as { from?: string } | null)?.from
      const redirect = resolveRedirectPath(searchParams.get('callback'), from)
      router.replace(redirect)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : t('auth.loginFailed')
      Toast.show({ icon: 'fail', content: message })
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="pg-login">
      <section className="pg-login__hero">
        <p className="pg-login__eyebrow">{import.meta.env.VITE_APP_TITLE}</p>
        <h1>{t('auth.login')}</h1>
        <p>{t('auth.subtitle')}</p>
      </section>

      <section className="pg-login__card">
        <Form
          layout="vertical"
          onFinish={onFinish}
          footer={(
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              loading={submitting}
              className="pg-login__submit"
            >
              {submitting ? t('auth.loggingIn') : t('auth.login')}
            </Button>
          )}
        >
          <Form.Item
            name="username"
            label={t('auth.username')}
            rules={[{ required: true, message: t('auth.usernameRequired') }]}
          >
            <Input
              placeholder={t('auth.usernamePlaceholder')}
              clearable
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[{ required: true, message: t('auth.passwordRequired') }]}
          >
            <Input
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              clearable
              autoComplete="current-password"
            />
          </Form.Item>
        </Form>

        {import.meta.env.DEV && (
          <p className="pg-login__hint">{t('auth.demoHint')}</p>
        )}
      </section>
    </main>
  )
}

export default Login
