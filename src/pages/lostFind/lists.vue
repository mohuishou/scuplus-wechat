<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
    font-size: 28rpx;
  }
  .list {
    // margin-bottom: 20rpx;
    padding: 20rpx;
    width: calc(~"100% - 40rpx");
    background: #fff;
    border-bottom: 2rpx solid #eee;
    display: flex;
    height: 180rpx;
    .preview {
      width: 240rpx;
      height: 180rpx;
      background-position: center;
      background-size: cover;
    }
    >view {
      width: calc(~"100% - 200rpx");
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      >view {
        width: 100%;
      }
      .info {
        display: flex;
        font-size: 24rpx;
        color: #888;
        >view {
          margin-right: 15rpx;
          display: flex;
          .iconfont {
            margin-right: 5rpx;
          }
        }
      }
    }
  }
</style>
<template>
  <view>
    <view></view>
    <scroll-view>
      <block wx:for="{{items}}">
        <view class="list">
          <view>
            <view class="title">
              一个钱包
            </view>
            <view class="info">
              <view class="name">
                <view class="iconfont icon-user"></view>
                <view> 某同学</view>
              </view>
              <view class="time">
                <view class="iconfont icon-time"></view>
                <view>2018-5-11</view>
              </view>
            </view>
          </view>
          <view class="preview" style="background-image: url(http://img.zcool.cn/community/01b37659aece1aa801211d251b0fef.png@1280w_1l_2o_100sh.webp)"></view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>
<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db";
  export default class BindJwc extends wepy.page {
    config = {}
    data = {
      items: [1, 2, 3, 4, 5, 6],
    }
  }
</script>
