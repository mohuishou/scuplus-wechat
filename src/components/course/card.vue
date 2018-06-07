<style lang="less">
  @import "./src/less/config";
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
</style>

<template>
  <view @tap="to" class="course-card">
    <view class="info">
      <view class="name">
        {{item.name}}
      </view>
      <view class="teacher">
        {{item.teacher}}
      </view>
    </view>
    <view class="tags">
      <view wx:if="{{item.exam_type}}" class="tag">{{item.exam_type}}</view>
      <view wx:if="{{item.call_name}}" class="tag">{{item.call_name}}</view>
      <view wx:if="{{item.task}}" class="tag">{{item.task}}</view>
      <!-- <view wx:if="{{item.avg_grade > 0}}" class="tag">平均分: {{item.avg_grade}}</view> -->
      <view wx:if="{{item.fail_rate == 0}}" class="tag">无挂科</view>
      <view wx:if="{{item.fail_rate > 0}}" class="tag">挂科率: {{item.fail_rate}}</view>
    </view>
  </view>
</template>

<script>
  import wepy from 'wepy'
  export default class Card extends wepy.component {
    props = {
      item: {
        type: Object,
        default: {}
      },
      isTo: {
        type: Boolean,
        default: true
      }
    }
    methods = {
      to() {
        if (!this.isTo) return;
        const q = `course_id=${this.item.course_id}&lesson_id=${this.item.lesson_id}`
        wepy.navigateTo({
          url: "/pages/course/details?" + q
        })
      }
    }
  }
</script>
