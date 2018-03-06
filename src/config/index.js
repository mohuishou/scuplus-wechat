const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const domains = {
  dev: 'https://test.api.scuplus.cn',
  // dev: 'http://localhost:8880',
  prod: 'https://api.scuplus.cn'
}
export const domain = domains[env]
export const version = '0.5.0'

