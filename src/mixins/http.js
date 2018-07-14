import wepy from 'wepy'
import {
  domain
} from '../config'
import db from '../util/db'
import Login from '../util/login'

export default class HttpMixin extends wepy.mixin {
  // GET请求
  GET(url, params = {}, showToast = true, handler = {}) {
    return this.request('GET', url, params, showToast, handler)
  }

  // POST请求
  POST(url, params = {}, showToast = true, handler = {}) {
    return this.request('POST', url, params, showToast, handler)
  }

  request(method, url, params = {}, showToast = true, handler = {}) {
    handler.url = domain + url
    handler.data = params
    handler.header = {
      'Authorization': 'Bearer ' + db.Get('token')
    }
    handler.method = method
    if (method === 'POST') {
      handler.header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    if (showToast) {
      wepy.showLoading && wepy.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    return new Promise((resolve, reject) => {
      handler.success = res => {
        if (showToast) wepy.hideLoading && wepy.hideLoading()
        if (res.statusCode === 401) {
          new Login().showErr()
          return
        }
        if (res.data.status === 0) {
          if (showToast) this.ShowToast(res.data.msg, 'success')
          resolve(res.data)
        } else {
          if (showToast) this.ShowToast(res.data.msg || res.data || '网络错误')
          reject(res)
        }
      }
      handler.fail = err => {
        if (showToast) wepy.hideLoading && wepy.hideLoading()
        if (showToast) this.ShowToast(JSON.stringify(err), 'error', 3000)
        reject(err)
      }
      wepy.request(handler)
    })
  }
}
