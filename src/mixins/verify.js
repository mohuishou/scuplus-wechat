import wepy from 'wepy'

export default class VerifyMixin extends wepy.mixin {
  verify() {
    const v = wx.getStorageSync('verify')
    if (v === 0) {
      wepy.navigateTo({
        url: '/pages/bind'
      })
    }
    return v
  }
}
