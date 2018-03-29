const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const domains = {
  dev: 'https://test.api.scuplus.cn',
  prod: 'https://api.scuplus.cn'
}
export const domain = domains[env]
export const version = '0.7.0'
