import wepy from 'wepy'

export default class ToastMixin extends wepy.mixin {
  data = {
    toastType: 'error',
    toastMsg: '更新成功',
    toastShow: false
  }

  ShowToast(msg, type = 'error', time = 2000) {
    this.toastMsg = msg
    this.toastType = type
    this.toastShow = true
    this.$apply()
    setTimeout(() => {
      this.toastShow = false
      this.$apply()
    }, time)
  }
}
