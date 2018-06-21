/**
 * 左右滑动组件
 * 需要在引入组件的页面自定函数：movePrev，moveNext
 */
import wepy from 'wepy'
export default class MoveMixin extends wepy.mixin {
  data = {
    moveClient: {
      changedX: 0,
      changedY: 0,
      startX: 0,
      startY: 0
    }
  }
  methods = {
    moveStart(e) {
      this.moveClient.startX = e.changedTouches[0].clientX
      this.moveClient.startY = e.changedTouches[0].clientY
    },
    moveEnd(e) {
      this.moveClient.changedX = e.changedTouches[0].clientX - this.moveClient.startX
      this.moveClient.changedY = e.changedTouches[0].clientY - this.moveClient.startY
      if (this.moveClient.changedX > 100) {
        // 右滑，上一页
        this.movePrev()
      } else if (this.moveClient.changedX < -100) {
        // 左滑，下一页
        this.moveNext()
      }
    }
  }
}
