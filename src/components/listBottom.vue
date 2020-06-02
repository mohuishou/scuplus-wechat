<style lang="less" scoped>
.mo-no-data {
  color: #888;
  display: flex;
  font-size: 28rpx;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  .mo-no-data-content {
    margin-left: 20rpx;
    margin-right: 20rpx;
  }
  .mo-no-data-left,
  .mo-no-data-right {
    height: 2rpx;
    width: 100rpx;
    background: #aaa;
  }
}
</style>
<template>
  <view class="mo-no-data">
    <view class="mo-no-data-left"></view>
    <view class="mo-no-data-content">{{isLast ? '到底啦' : '加载中...'}}</view>
    <view class="mo-no-data-right"></view>
  </view>
</template>
<script>
import wepy from 'wepy'
export default class ListBottom extends wepy.component {
  props = {
    isLast: {
      type: Boolean,
      default: true
    }
  };
}
</script>
