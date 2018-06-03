import {
  domain
} from '../config'
import db from './db'

const ShowToast = (msg, type = 'error', time = 2000) => {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: time
  })
}

function GetWithBind(url, params = {}, handler = {}) {
  return requestWithBind('GET', url, params, handler)
}

function PostWithBind(url, params = {}, handler = {}) {
  return requestWithBind('POST', url, params, handler)
}

async function requestWithBind(method, url, params = {}, handler = {}) {
  if (wx.getStorageSync('verify') === 0) {
    wx.showModal({
      title: '绑定',
      content: '统一认证平台未绑定或密码错误，是否跳转到绑定页面？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/bind'
          })
        } else if (res.cancel) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
    throw '未绑定账号'
  } else {
    return request(method, url, params, handler)
  }
}

// GET请求
function GET(url, params = {}, handler = {}) {
  return request('GET', url, params, handler)
}

// POST请求
function POST(url, params = {}, handler = {}) {
  return request('POST', url, params, handler)
}

function request(method, url, params = {}, handler = {}) {
  handler.url = domain + url
  handler.data = params
  handler.header = {
    'Authorization': 'Bearer ' + db.Get('token')
  }
  handler.method = method
  if (method === 'POST') {
    handler.header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  wx.showLoading && wx.showLoading({
    title: '加载中...'
  })

  return new Promise((resolve, reject) => {
    handler.success = res => {
      if (res.data.status === 0) {
        ShowToast(res.data.msg, 'success')
        resolve(res.data)
      } else {
        ShowToast(res.data.msg || res.data || '网络错误')
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
    handler.complete = () => wx.hideLoading && wx.hideLoading()
    wx.request(handler)
  })
}

export {
  GET,
  POST,
  GetWithBind as GetB,
  PostWithBind as PostB
}
