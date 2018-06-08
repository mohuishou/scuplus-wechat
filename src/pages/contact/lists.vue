<style lang="less">
@import "./src/less/config";
page {
  backgroud: @bg-color;
}
.card{
  margin: 10rpx;
  background: @white;
  .title{
    
  }
}
</style>
<template>
  <view>
    <view class="card">
      <view class="title">教务处</view>
      <view class="time">2018-06-06</view>
    </view>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
export default class ContactLists extends wepy.page {
  config = {};
  mixins = [HttpMixin, ToastMixin];
}
</script>
