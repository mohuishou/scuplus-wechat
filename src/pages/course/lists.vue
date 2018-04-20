<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
  }
  .course-card {
    font-size: 28rpx;
    margin-top: 15rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
    padding: 20rpx 20rpx;
    border-radius: 4rpx;
    display: flex;
    height: 150rpx;
    border: 2rpx solid #eee;
    box-shadow: 4rpx 4rpx 8rpx #e8e8e8;
    background: #fff;
    flex-wrap: wrap;
    align-content: space-between;
    > view {
      width: 100%;
    }
    .info {
      display: flex;
      justify-content: space-between;
      .teacher {
        color: #888;
      }
    }
    .tags {
      .tag {
        border-radius: 6rpx;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4rpx 12rpx;
        margin: 0rpx 10rpx 10rpx 0rpx;
        font-size: 26rpx;
        color: @base-color;
        border: 2rpx solid @base-color;
      }
    }
  }
  .tabs {
    display: flex;
    background: #fff;
    font-size: 28rpx;
    padding: 0 20rpx;
    height: 50rpx;
    .tab {
      text-align: center;
      flex: 1;
      text {
        color: #888;
        font-size: 24rpx;
      }
    }
  }
</style>

<template>
  <view>
    <view class="tabs">
      <view class="tab">
        <view class="iconfont icon-search"></view>
      </view>
      <view class="tab">
        测试
      </view>
      <view class="tab">
        测试
      </view>
      <view class="tab">
        测试
      </view>
      <view class="tab">
        测试
      </view>
      <view class="tab">
        测试
      </view>
      <view class="tab">
        测试
      </view>
    </view>
    <view class="course-card">
      <view class="info">
        <view class="name">
          大学英语
        </view>
        <view class="teacher">
          某某某等
        </view>
      </view>
      <view class="tags">
        <view class="tag">偶尔点名</view>
        <view class="tag">考试</view>
        <view class="tag">好评:1</view>
      </view>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db";
  import DataMixin from "mixins/data";
  import TermMixin from "mixins/term";
  export default class CourseLists extends wepy.page {
    config = {};
    data = {};
    methods = {};
    onLoad() {}
  }
</script>
