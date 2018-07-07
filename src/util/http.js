import {
  domain
} from '../config'
import db from './db'

export default class Http {
  static Get(url, params = {}, isShow = true, handler = {}) {
    return request('GET', url, params, isShow, handler)
  }
  static Post(url, params = {}, isShow = true, handler = {}) {
    return request('POST', url, params, isShow, handler)
  }
}

const ShowToast = (msg, type = 'error', time = 2000) => {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: time
  })
}

function request(method, url, params = {}, isShow = true, handler = {}) {
  handler.url = domain + url
  handler.data = params
  handler.header = {
    'Authorization': 'Bearer ' + db.Get('token')
  }
  handler.method = method
  if (method === 'POST') {
    handler.header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  isShow && wx.showLoading && wx.showLoading({
    title: '加载中...'
  })

  return new Promise((resolve, reject) => {
    handler.success = res => {
      if (res.data.status === 0) {
        isShow && ShowToast(res.data.msg, 'success')
        resolve(res.data)
      } else {
        isShow && ShowToast(res.data.msg || res.data || '网络错误')
        reject(res)
      }
    }
    handler.fail = err => {
      wx.showModal({
        title: '网络错误',
        content: JSON.stringify(err),
        showCancel: false
      })
      reject(err)
    }
    handler.complete = () => isShow && wx.hideLoading && wx.hideLoading()
    wx.request(handler)
  })
}
