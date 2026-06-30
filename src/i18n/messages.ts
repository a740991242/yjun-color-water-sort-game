type Locale = 'zh-CN' | 'en-US'

type MessageKey
  = | 'app.name'
    | 'auth.login'
    | 'auth.logout'
    | 'auth.username'
    | 'auth.password'
    | 'auth.usernamePlaceholder'
    | 'auth.passwordPlaceholder'
    | 'auth.usernameRequired'
    | 'auth.passwordRequired'
    | 'auth.loginSuccess'
    | 'auth.loginFailed'
    | 'auth.loggingIn'
    | 'auth.demoHint'
    | 'auth.phone'
    | 'auth.code'
    | 'auth.secure'
    | 'auth.subtitle'
    | 'home.title'
    | 'home.subtitle'
    | 'home.search'
    | 'home.risk'
    | 'home.report'
    | 'home.devices'
    | 'home.consult'
    | 'home.records'
    | 'home.medication'
    | 'home.ai'
    | 'home.follow'
    | 'home.vitals'
    | 'home.next'
    | 'mine.title'
    | 'mine.member'
    | 'mine.family'
    | 'mine.privacy'
    | 'mine.language'
    | 'mine.security'
    | 'tab.home'
    | 'tab.mine'

const messages: Record<Locale, Record<MessageKey, string>> = {
  'zh-CN': {
    'app.name': 'MedFlow',
    'auth.login': '账号登录',
    'auth.logout': '退出登录',
    'auth.username': '账号',
    'auth.password': '密码',
    'auth.usernamePlaceholder': '请输入账号',
    'auth.passwordPlaceholder': '请输入密码',
    'auth.usernameRequired': '请输入账号',
    'auth.passwordRequired': '请输入密码',
    'auth.loginSuccess': '登录成功',
    'auth.loginFailed': '登录失败',
    'auth.loggingIn': '登录中...',
    'auth.demoHint': '开发环境演示：admin / admin123',
    'auth.phone': '手机号',
    'auth.code': '验证码',
    'auth.secure': '医疗数据本地加密，登录仅用于演示',
    'auth.subtitle': '登录后使用 H5 移动工作台',
    'home.title': '健康中枢',
    'home.subtitle': '早上好，林医生',
    'home.search': '搜索患者、报告、设备',
    'home.risk': '风险预警',
    'home.report': '报告解读',
    'home.devices': '设备在线',
    'home.consult': '在线问诊',
    'home.records': '健康档案',
    'home.medication': '用药提醒',
    'home.ai': 'AI 初筛',
    'home.follow': '随访计划',
    'home.vitals': '生命体征',
    'home.next': '下一位待随访患者',
    'mine.title': '我的',
    'mine.member': '智慧医疗团队',
    'mine.family': '家庭成员',
    'mine.privacy': '隐私与授权',
    'mine.language': '语言',
    'mine.security': '安全中心',
    'tab.home': '首页',
    'tab.mine': '我的',
  },
  'en-US': {
    'app.name': 'MedFlow',
    'auth.login': 'Sign In',
    'auth.logout': 'Sign Out',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.usernamePlaceholder': 'Enter username',
    'auth.passwordPlaceholder': 'Enter password',
    'auth.usernameRequired': 'Username is required',
    'auth.passwordRequired': 'Password is required',
    'auth.loginSuccess': 'Signed in',
    'auth.loginFailed': 'Sign in failed',
    'auth.loggingIn': 'Signing in...',
    'auth.demoHint': 'Dev demo: admin / admin123',
    'auth.phone': 'Phone',
    'auth.code': 'Code',
    'auth.secure': 'Medical data is locally protected. Login is demo only.',
    'auth.subtitle': 'Sign in to access the mobile workspace',
    'home.title': 'Health Hub',
    'home.subtitle': 'Good morning, Dr. Lin',
    'home.search': 'Search patients, reports, devices',
    'home.risk': 'Risk Alerts',
    'home.report': 'Report AI',
    'home.devices': 'Devices',
    'home.consult': 'Telehealth',
    'home.records': 'Records',
    'home.medication': 'Medication',
    'home.ai': 'AI Triage',
    'home.follow': 'Follow-up',
    'home.vitals': 'Vitals',
    'home.next': 'Next follow-up patient',
    'mine.title': 'Profile',
    'mine.member': 'Smart Care Team',
    'mine.family': 'Family Members',
    'mine.privacy': 'Privacy & Consent',
    'mine.language': 'Language',
    'mine.security': 'Security Center',
    'tab.home': 'Home',
    'tab.mine': 'Mine',
  },
}

export { messages }
export type { Locale, MessageKey }
