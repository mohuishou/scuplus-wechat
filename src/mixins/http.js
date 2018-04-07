import wepy from 'wepy'
import {
  domain
} from '../config'
import db from '../util/db'

export default class HttpMixin extends wepy.mixin {
  GetWithLibrary(url, params = {}, showToast = true, handler = {}) {
    return this.requestWithBind('GET', url, params, showToast, handler, 'library')
  }

  PostWithLibrary(url, params = {}, showToast = true, handler = {}) {
    return this.requestWithBind('POST', url, params, showToast, handler, 'library')
  }

  GetWithBind(url, params = {}, showToast = true, handler = {}, type = 'bind') {
    return this.requestWithBind('GET', url, params, showToast, handler, type)
  }

  PostWithBind(url, params = {}, showToast = true, handler = {}, type = 'bind') {
    return this.requestWithBind('POST', url, params, showToast, handler, type)
  }

  async requestWithBind(method, url, params = {}, showToast = true, handler = {}, type = 'bind') {
    if (type === 'bind' && db.Get('verify') == 0) {
      wepy.showModal({
        title: '绑定',
        content: '统一认证平台未绑定或密码错误，是否跳转到绑定页面？',
        success: function (res) {
          if (res.confirm) {
            wepy.navigateTo({
              url: '/pages/bind'
            })
          } else if (res.cancel) {
            wepy.navigateBack({
              delta: 1
            })
          }
        }
      })
      throw '未绑定账号'
    } else if (type === 'library' && db.Get('library_verify') == 0) {
      wepy.showModal({
        title: '账号信息错误',
        content: '图书馆账号未绑定或密码错误！是否前往绑定？',
        success: function (res) {
          if (res.confirm) {
            wepy.navigateTo({
              url: '/pages/bind?type=library'
            })
          }
        }
      })
      throw '未绑定账号'
    } else {
      return this.request(method, url, params, showToast, handler)
    }
  }

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
        title: '加载中...'
      })
    }

    return new Promise((resolve, reject) => {
      handler.success = res => {
        if (showToast) wepy.hideLoading && wepy.hideLoading()
        if (res.data.status === 0) {
          if (showToast) this.ShowToast(res.data.msg, 'success')
          resolve(res.data)
        } else {
          if (showToast) this.ShowToast(res.data.msg || res.data || '网络错误')
          reject(res)
        }
      }
      handler.fail = () => {
        if (showToast) wepy.hideLoading && wepy.hideLoading()
        if (showToast) this.ShowToast('网络错误', 'error', 3000)
        reject('Network request failed')
      }
      wepy.request(handler)
    })
  }
}
