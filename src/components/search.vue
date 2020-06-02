<style lang="less" scoped>
@import url("./src/less/config");
page {
  background: @bg-color;
}
.search {
  padding: 10rpx 20rpx;
  background: #fff;
  width: 100%;
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  height: 100rpx;
  align-items: center;
  border-bottom: 2rpx solid #ddd;
  flex-wrap: nowrap;
  input {
    width: calc(~"100% - 260rpx");
    font-size: 28rpx;
    padding: 10rpx;
    padding-left: 20rpx;
    height: 40rpx;
    background: #f6f6f6;
  }
  button {
    border-radius: 0;
    width: 150rpx;
    height: 60rpx;
    font-size: 28rpx;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, @base-color, #ed5a65);
    color: #fff;
    font-size: 28rpx;
  }
}
</style>
<template>
  <form @submit="submit">
    <view class="search">
      <input @confirm="search" name="name" placeholder="{{title}}" confirm-type="search" auto-focus="{{autoFocus}}" />
      <button form-type="submit">搜索</button>
    </view>
  </form>
</template>
<script>
import wepy from 'wepy'
export default class Share extends wepy.component {
  props = {
    title: String,
    autoFocus: {
      type: Boolean,
      default: true
    }
  };
  methods = {
    submit(e) {
      this.$emit('search', e.detail.value.name)
    },
    search(e) {
      this.$emit('search', e.detail.value)
    }
  };
}
</script>
