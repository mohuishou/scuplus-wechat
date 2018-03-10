import wepy from 'wepy'
import db from "../util/db"
export default class DataMixin extends wepy.mixin {
  /**
   * 数据初始化
   * 注意：获取数据的方法必须是 this.get()
   * @param {String} data_name 数据名
   * @param {number} h 缓存多少小时
   */
  async Init(data_name, h = 6) {
    const now = (new Date()).getTime()
    const update_time = db.Get("update_time." + data_name) || 0
    if ((now - update_time) / 1000 / 3600 < h && db.Get(data_name)) {
      this[data_name] = db.Get(data_name);
      this.$apply();
    } else {
      await this.get()
    }
  }

  /**
   * 设置缓存
   * @param {String} data_name 
   * @param {any} data 
   */
  InitSet(data_name, data) {
    db.Set(data_name, data)
    db.Set("update_time." + data_name, (new Date()).getTime())
  }
}
