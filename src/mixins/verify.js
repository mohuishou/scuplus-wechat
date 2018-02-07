import wepy from 'wepy';

export default class VerifyMixin extends wepy.mixin {
  verify(){
    const data = this.$root.$parent.globalData
    if (data.verify == 0) {
      wepy.navigateTo({
        url: "bind"
      });
    }
    return data.verify;
  }
}
