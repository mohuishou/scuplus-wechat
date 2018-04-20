<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
    font-size: 28rpx;
  }
  .panel {
    margin-top: 15rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
    padding: 20rpx 20rpx;
    border-radius: 4rpx;
    display: flex;
    height: 150rpx;
    border: 2rpx solid #eee;
    box-shadow: 2rpx 2rpx 4rpx #e8e8e8;
    background: #fff;
  }
  .course-card {
    flex-wrap: wrap;
    align-content: space-between;
    >view {
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
  .address {
    height: 100rpx;
    >view {
      display: flex;
      align-content: space-between;
      flex-wrap: wrap;
      >view {
        width: 100%;
      }
    }
    .title {
      color: #888;
    }
  }
  .course-info {
    flex-wrap: wrap;
    height: auto;
    .all {
      width: 100%;
      height: 50rpx;
      >view {
        flex: 3;
      }
      .title {
        flex: 1;
      }
    }
    >view {
      display: flex;
      flex-wrap: wrap;
      width: 50%;
      margin-top: 10rpx;
      .title {
        color: #888;
      }
      >view {
        display: flex;
        flex-wrap: wrap;
        >view {
          height: 50rpx;
          width: 100%;
        }
      }
    }
  }
  .course-eva {
    height: 50rpx;
    >view {
      text-align: center;
      flex: 1;
      &:nth-child(2) {
        border-left: 3rpx solid #ddd;
        border-right: 3rpx solid #ddd;
      }
    }
  }
</style>

<template>
  <view>
    <view class="course-card panel">
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
    <view class="course-info panel">
      <view>
        <view class="title">
          <view>课程号</view>
          <view>课序号</view>
        </view>
        <view>
          <view>100098928</view>
          <view>103</view>
        </view>
      </view>
      <view>
        <view class="title">
          <view>学分</view>
          <view>考试类型</view>
        </view>
        <view>
          <view>5.0</view>
          <view>考查</view>
        </view>
      </view>
      <view class="all">
        <view class="title">
          <view>学院</view>
        </view>
        <view>
          <view>电子信息学院</view>
        </view>
      </view>
      <view class="all">
        <view class="title">
          <view>选课限制</view>
        </view>
        <view>
          <view>无</view>
        </view>
      </view>
    </view>
    <view class="course-eva panel">
      <view>
        很赞 1
      </view>
      <view>
        很赞 1
      </view>
      <view>
        很赞 1
      </view>
    </view>
    <view class="comments panel">
      <view class="comment">
        <view>
          <view class="avatar">
          </view>
          <view>
            <view class="username"></view>
            <view class="time"></view>
          </view>
          <view class="star"></view>
        </view>
        <view class="content">
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
    config = {};
    data = {};
    methods = {};
    onLoad() {}
  }
</script>
