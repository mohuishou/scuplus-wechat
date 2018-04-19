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
    >view {
      flex: 1;
    }
    .info {
      color: #333;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      padding-right: 20rpx;
      border-right: 3rpx solid #ddd;
      text {
        color: #999;
      }
      view {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    .tags {
      padding-left: 20rpx;
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
</style>

<template>
  <view>
    <view class="course-card">
      <view class="info">
        <view class="name">
          <text>课程</text> 大学英语
        </view>
        <view class="teacher">
          <text>教师</text> 莫莫莫等
        </view>
      </view>
      <view class="tags">
        <view class="tag">
          不点名
        </view>
        <view class="tag">
          无作业
        </view>
        <view class="tag">
          考试
        </view>
        <view class="tag">
          挂科率15%
        </view>
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
    config = {}
    data = {}
    methods = {}
    onLoad() {
    }
  }
</script>
