import wepy from 'wepy'
import {domain} from '../config'

export default class HttpMixin extends wepy.mixin {
  GetWithBind(url, params = {}, handler = {}) {
    return this.requestWithBind('GET', url, params, handler)
  }

  PostWithBind(url, params = {}, handler = {}) {
    return this.requestWithBind('POST', url, params, handler)
  }

  async requestWithBind(method, url, params = {}, handler = {}) {
    if (wepy.getStorageSync('verify') === 0) {
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
    } else {
      return this.request(method, url, params, handler)
    }
  }

  // GET请求
  GET(url, params = {}, handler = {}) {
    return this.request('GET', url, params, handler)
  }

  // POST请求
  POST(url, params = {}, handler = {}) {
    return this.request('POST', url, params, handler)
  }

  request(method, url, params = {}, handler = {}) {
    handler.url = domain + url
    handler.data = params
    handler.header = {
      'Authorization': 'Bearer ' + wepy.getStorageSync('token')
    }
    handler.method = method
    if (method === 'POST') {
      handler.header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    wepy.showLoading && wepy.showLoading({
      title: '加载中...'
    })

    return new Promise((resolve, reject) => {
      handler.success = res => {
        if (res.data.status === 0) {
          this.ShowToast(res.data.msg, 'success')
          resolve(res.data)
        } else {
          this.ShowToast(res.data.msg)
          reject(res)
        }
      }
      handler.fail = () => {
        this.ShowToast('网络错误', 'error', 3000)
        reject('Network request failed')
      }
      handler.complete = () => wepy.hideLoading && wepy.hideLoading()
      wepy.request(handler)
    })
  }
}
