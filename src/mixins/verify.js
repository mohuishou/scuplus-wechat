import wepy from 'wepy';

export default class VerifyMixin extends wepy.mixin {
  verify(){
    const data = this.$root.$parent.globalData
    console.log(data.verify);
    
    if (data.verify == 0) {
      wepy.navigateTo({
        url: "/pages/bind"
      });
    }
    return data.verify;
  }
}