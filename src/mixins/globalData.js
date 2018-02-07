import wepy from 'wepy';

export default class GlobalDataMixin extends wepy.mixin {
  SetData(key, value) {
    this.$root.$parent.globalData[key] = value;
    wepy.setStorage({
      key: key,
      data: value
    });
  }
  GetData(key){
    return this.$root.$parent.globalData[key]
  }
}
