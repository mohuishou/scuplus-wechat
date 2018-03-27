import wepy from 'wepy'

export default class ToastMixin extends wepy.mixin {
  ShowToast(msg, type = 'error', time = 2000) {
    wepy.showToast({
      title: msg,
      icon: 'none',
      duration: time
    })
  }
}
