<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
    font-size: 28rpx;
  }
  .screenshots {
    width: 100%;
    height: 422rpx;
    .slide-image {
      width: 100%;
      height: 422rpx;
      background-size: cover;
      background-position: center;
    }
  }
  .header {
    &.group {
      border-top: none;
    }
    .name {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 30rpx;
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
  .group {
    background: #fff;
    padding: 20rpx;
    margin-bottom: 15rpx;
    border-bottom: 2rpx solid #eee;
    border-top: 2rpx solid #eee;
    &.screenshot {
      margin-bottom: 0;
      border-bottom: none;
      .title {
        margin-bottom: 0;
      }
    }
    .title {
      margin-bottom: 30rpx;
      border-left: 10rpx solid @base-color;
      padding-left: 20rpx;
    }
  }
</style>
<template>
  <view>
    <view class="header group">
      <view class="name">
        一个钱包
      </view>
      <view class="info">
        <view class="user">
          <view class="iconfont icon-user"></view>
          <view>某同学</view>
        </view>
        <view class="time">
          <view class="iconfont icon-time"></view>
          <view>2018-5-11</view>
        </view>
      </view>
    </view>
    <view class="group">
      <view class="title">
        描述
      </view>
      <view class="content">
        打算上了撒打算打算的凡人歌市府大道
      </view>
    </view>
    <view class="group">
      <view class="title">
        地点
      </view>
      <view class="content">
        江安
      </view>
    </view>
    <view class="group">
      <view class="title">
        联系方式
      </view>
      <view class="content">
        某同学（QQ：4567899876）
      </view>
    </view>
    <view class="group screenshot">
      <view class="title">
        截图
      </view>
    </view>
    <swiper class="screenshots">
      <block wx:for="{{images}}">
        <swiper-item>
          <view style="background-image: url({{item}})" class="slide-image"></view>
        </swiper-item>
      </block>
    </swiper>
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
      images: ["http://img.zcool.cn/community/01b37659aece1aa801211d251b0fef.png@1280w_1l_2o_100sh.webp"],
      height: 500,
    }
  }
</script>
