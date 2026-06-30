import type { Locale, MessageKey } from './messages'
import { createContext } from 'react'

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)
