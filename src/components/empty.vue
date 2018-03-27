<style lang="less">
  #empty {
    width: 100%;
    height: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .iconfont {
      font-size: 2rem;
      color: #f06292;
    }
  }
</style>

<template>
  <view id="empty">
    <view>
      <view class="iconfont icon-fail"></view>
      <view>{{msg}}</view>
    </view>
  </view>
</template>

<script>
  import wepy from 'wepy'
  export default class Empty extends wepy.component {
    props = {
      msg: {
        type: String,
        default: "没有数据"
      }
    }
  }
</script>
