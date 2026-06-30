import { AppTabbar } from '@/components/app-tabbar'
import { useRouter } from '@/hooks'
import { useAuthStore } from '@/store'

import './index.scss'

const stats = [
  { label: '本月服务', value: '328' },
  { label: '转化客户', value: '76' },
  { label: '待处理', value: '12' },
]

const menus = [
  { title: '我的客户', desc: '跟进记录与标签管理' },
  { title: '活动记录', desc: '报名、核销、回访明细' },
  { title: '消息中心', desc: '系统通知与待办提醒' },
  { title: '系统设置', desc: '账号、安全与偏好设置' },
]

function Mine() {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <main className="pg-mine">
      <section className="pg-mine__profile">
        <div className="pg-mine__avatar">{user.name.slice(0, 1)}</div>
        <div>
          <h1>{user.name}</h1>
          <p>{user.role}</p>
          <span>{user.phone}</span>
        </div>
      </section>

      <section className="pg-mine__stats">
        {stats.map(item => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="pg-mine__panel">
        {menus.map(item => (
          <button key={item.title} type="button">
            <span>
              <strong>{item.title}</strong>
              <em>{item.desc}</em>
            </span>
            <i>›</i>
          </button>
        ))}
      </section>

      <button className="pg-mine__logout" type="button" onClick={handleLogout}>退出登录</button>
      <AppTabbar />
    </main>
  )
}

export default Mine
