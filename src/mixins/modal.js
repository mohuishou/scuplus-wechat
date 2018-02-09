import wepy from 'wepy';

export default class ModalMixin extends wepy.mixin {
  Alert(msg) {
    return new Promise(resolve => {
      wepy.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            resolve()
          }
        }
      })
    })
  }

  Modal(title, content) {
    return new Promise((resolve, reject) => {
      wepy.showModal({
        title: title,
        content: content,
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject()
          }
        }
      })
    })
  }
}
