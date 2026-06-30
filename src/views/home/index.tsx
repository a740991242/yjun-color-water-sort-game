import { m } from 'motion/react'

import { MotionContainer } from '@/components/animate'
import { varFade } from '@/components/animate/variants'

import './index.scss'

const quickActions = [
  { label: '客户跟进', value: '128', tone: 'green' },
  { label: '待办审批', value: '24', tone: 'blue' },
  { label: '活动报名', value: '86', tone: 'pink' },
  { label: '数据看板', value: '12', tone: 'violet' },
]

const services = [
  { title: '门店巡检', desc: '今日 6 个点位', icon: '巡' },
  { title: '客户建档', desc: '扫码录入资料', icon: '客' },
  { title: '优惠核销', desc: '券码快速验证', icon: '券' },
  { title: '消息触达', desc: '短信/企微提醒', icon: '信' },
  { title: '库存盘点', desc: '移动端录入', icon: '库' },
  { title: '异常上报', desc: '照片定位同步', icon: '报' },
]

const campaigns = [
  { name: '春季新品会员日', progress: 72, tag: '进行中' },
  { name: '城市门店拉新计划', progress: 45, tag: '重点' },
  { name: '老客回访礼遇', progress: 88, tag: '收尾' },
]

function Home() {
  return (
    <main className="pg-home">
      <section className="pg-home__top">
        <div>
          <p className="pg-home__eyebrow">H5 移动工作台</p>
          <h1>今日运营</h1>
        </div>
        <button className="pg-home__avatar" type="button" aria-label="个人中心">
          Y
        </button>
      </section>

      <MotionContainer className="pg-home__content">
        <m.section variants={varFade().inUp} className="pg-home__search">
          <span />
          <input placeholder="搜索客户、活动、订单" aria-label="搜索" />
        </m.section>

        <m.section variants={varFade().inUp} className="pg-home__banner">
          <div>
            <p>增长活动</p>
            <h2>会员日预约已开启</h2>
            <span>移动端报名、核销、回访一站完成</span>
          </div>
          <button type="button">查看</button>
        </m.section>

        <m.section variants={varFade().inUp} className="pg-home__metrics">
          {quickActions.map(item => (
            <div key={item.label} className={`pg-home__metric pg-home__metric--${item.tone}`}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </m.section>

        <m.section variants={varFade().inUp} className="pg-home__panel">
          <div className="pg-home__section-title">
            <h3>常用服务</h3>
            <button type="button">全部</button>
          </div>
          <div className="pg-home__services">
            {services.map(item => (
              <button key={item.title} className="pg-home__service" type="button">
                <i>{item.icon}</i>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>
        </m.section>

        <m.section variants={varFade().inUp} className="pg-home__task">
          <div>
            <p>今日重点</p>
            <h3>还有 9 个客户待回访</h3>
            <span>建议优先处理高意向客户与未完成核销订单</span>
          </div>
          <button type="button">开始处理</button>
        </m.section>

        <m.section variants={varFade().inUp} className="pg-home__panel pg-home__campaigns">
          <div className="pg-home__section-title">
            <h3>活动进度</h3>
            <button type="button">刷新</button>
          </div>
          {campaigns.map(item => (
            <article key={item.name} className="pg-home__campaign">
              <div>
                <strong>{item.name}</strong>
                <span>{item.tag}</span>
              </div>
              <div className="pg-home__progress">
                <i style={{ width: `${item.progress}%` }} />
              </div>
              <em>
                {item.progress}
                %
              </em>
            </article>
          ))}
        </m.section>
      </MotionContainer>

      <nav className="pg-home__tabbar">
        <button className="is-active" type="button">首页</button>
        <button type="button">客户</button>
        <button type="button">活动</button>
        <button type="button">我的</button>
      </nav>
    </main>
  )
}

export default Home
