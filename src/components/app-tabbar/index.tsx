import { useLocation, useNavigate } from 'react-router'

import { useI18n } from '@/i18n'

import './index.scss'

const tabs = [
  { path: '/home', label: 'tab.home', icon: '⌂' },
  { path: '/mine', label: 'tab.mine', icon: '◉' },
] as const

export function AppTabbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <nav className="app-tabbar" aria-label="Primary">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={pathname === tab.path ? 'is-active' : ''}
          onClick={() => navigate(tab.path)}
          type="button"
        >
          <i>{tab.icon}</i>
          <span>{t(tab.label)}</span>
        </button>
      ))}
    </nav>
  )
}
