function JwcVerify() {
  let jwc_verify = wx.getStorageSync("jwc_verify");
  if (!jwc_verify) {
    wx.showModal({
      title: "账号信息错误",
      content: "教务处账号未绑定或密码错误！是否前往绑定？",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: 'bindJwc'
          });
        } else if (res.cancel) {
          wx.navigateBack({delta: 1})
        }
      }
    })
    return false
  }
  return true
}

module.exports = {
  jwcVerify: JwcVerify,
}
