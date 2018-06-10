<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 30rpx;
}
.card {
  margin: 20rpx;
  background: @white;
  border-radius: 10rpx;
  box-shadow: 4rpx 4rpx 10rpx #eee;
  padding: 20rpx;
  .title {
  }
  .time {
    font-size: 26rpx;
    color: #888;
    margin-top: 20rpx;
  }
}
</style>
<template>
  <view>
    <block wx:for="{{items}}" wx:key="index">
      <view class="card" @tap="to({{index}})">
        <view class="title">{{item.name}}</view>
        <!-- <view class="time">更新时间: 2018-06-06</view> -->
      </view>
    </block>

  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
export default class ContactLists extends wepy.page {
  config = {
    navigationBarTitleText: "校园通讯录"
  };
  mixins = [HttpMixin, ToastMixin];
  data = {
    items: {}
  };

  methods = {
    to(i) {
      const item = this.items[i]
      wepy.navigateTo({ url: "/pages/contact/detail?category=" + JSON.stringify(item) });
    }
  };

  async get() {
    try {
      const res = await this.GET("/contact/categories");
      this.items = res.data;
      this.$apply();
    } catch (error) {
      console.error(error);
    }
  }

  onLoad() {
    this.get();
  }
}
</script>
