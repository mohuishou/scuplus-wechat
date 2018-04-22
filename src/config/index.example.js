const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const domains = {
  dev: 'https://test.api.com', // 测试api接口
  prod: 'https://api.com' // api接口
}
export const domain = domains[env]
export const version = '0.8.0' // 版本号
