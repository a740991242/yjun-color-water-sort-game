import type { ReactNode } from 'react'
import type { Locale, MessageKey } from './messages'
import { useEffect, useMemo, useState } from 'react'
import { I18nContext } from './context'
import { messages } from './messages'

const storageKey = 'medflow-locale'

function getInitialLocale(): Locale {
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'zh-CN' || stored === 'en-US') {
    return stored
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    window.localStorage.setItem(storageKey, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: MessageKey) => messages[locale][key],
    }),
    [locale],
  )

  return <I18nContext value={value}>{children}</I18nContext>
}
