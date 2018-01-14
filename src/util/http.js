const config = require("../config/config.js")
let domain = config.domain

let token = wx.getStorageSync("token");


//GET请求
function GET(requestHandler) {
  if (typeof requestHandler === 'string') {
    requestHandler = {
      url: String(requestHandler),
      params: {}
    }
  }
  return request('GET', requestHandler)
}

//POST请求
function POST(requestHandler) {
  return request('POST', requestHandler)
}

function request(method, requestHandler) {
  let header = {
    "Authorization": "Bearer " + wx.getStorageSync("token")
  }
  if (method == "POST") {
    header["content-type"] = "application/x-www-form-urlencoded; charset=UTF-8"
  }
  wx.showLoading && wx.showLoading({
    title: '加载中...'
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: domain + requestHandler.url,
      data: requestHandler.params,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: header, // 设置请求的 header
      success: function (res) {
        //解密
        resolve(res.data)
      },
      fail: function () {
        wx.showModal({
          title: "网络错误",
          content: "网络错误",
        });
        reject('Network request failed')
      },
      complete: function () {
        wx.hideLoading && wx.hideLoading()
      }
    })
  })

}

module.exports = {
  get: GET,
  post: POST
}
