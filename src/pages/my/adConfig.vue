<style lang="less">
page {
  font-size: 30rpx;
}
.group {
  display: flex;
  padding: 20rpx;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2rpx solid #ddd;
}
</style>
<template>
  <view>
    <block wx:for="{{adConfig}}" wx:key="index">
      <view class="group">
        <view class="title">
          {{item.name}}
        </view>
        <switch checked="{{item.value}}" @change="change({{item.key}})" />
      </view>
    </block>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import ADConfig from "util/ad";
export default class My extends wepy.page {
  config = {
    navigationBarTitleText: "通知设置"
  };
  mixins = [HttpMixin, ToastMixin];
  data = {
    adConfig: []
  };
  methods = {
    change(k, e) {
      ADConfig.Set(k, e.detail.value);
    }
  };

  onLoad() {
    this.adConfig = ADConfig.GetConfig();
  }
}
</script>
