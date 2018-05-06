<style lang="less">
  @import "./src/less/config.less";
  page {
    background: #f8f8f5;
  }
  .exam {
    background: #fff;
    overflow: hidden;
    margin: 20rpx;
    padding: 20rpx;
    border-radius: 10rpx;
    box-shadow: 4rpx 4rpx 20rpx #c4c3cb;
    .header {
      display: flex;
      .name {
        color: #555;
        &.active {
          color: @base-color;
        }
      }
      .info {
        margin-top: 10rpx;
        color: #999;
        font-size: 30rpx;
      }
      .left {
        width: calc(~"100% - 60rpx");
      }
      .right {
        width: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40rpx;
        color: #999;
        transition: all 0.5s;
        &.active {
          transform: rotate(180deg);
          transition: all 0.5s;
        }
      }
    }
    .content {
      height: 0;
      color: #555;
      transition: all 0.5s;
      margin-top: 10rpx;
      &.active {
        height: 400rpx;
        transition: all 0.5s;
        .list {
          border-bottom: 3rpx dashed #eee;
          &:first-child {
            border-top: 3rpx dashed #eee;
          }
        }
      }
      .list {
        display: flex;
        height: 80rpx;
        align-items: center;
        .title {
          flex: 1;
        }
        .data {
          flex: 4;
        }
      }
    }
  }
</style>

<template>
  <view wx:if="{{exams.length > 0}}">
    <block wx:for="{{exams}}" wx:key="{{index}}">
      <view @tap="active({{index}})" class="exam">
        <view class="header">
          <view class="left">
            <view class="name  {{item.active ? 'active' : ''}}">
              {{item.course_name}}
            </view>
            <view class="info">
              {{item.time_info}} （{{item.time}}）{{item.campus}} {{item.building}}
            </view>
          </view>
          <view class="right {{item.active ? 'active' : ''}}">
            <view class="iconfont icon-jiantouarrow483"></view>
          </view>
        </view>
        <view class="content {{item.active ? 'active' : ''}}">
          <view class="list">
            <view class="title">类型</view>
            <view class="data">{{item.name}}</view>
          </view>
          <view class="list">
            <view class="title">日期</view>
            <view class="data">{{item.date}}</view>
          </view>
          <view class="list">
            <view class="title">时间</view>
            <view class="data">{{item.time}}</view>
          </view>
          <view class="list">
            <view class="title">地点</view>
            <view class="data">{{item.campus}} {{item.building}} {{item.classroom}}</view>
          </view>
          <view class="list">
            <view class="title">座位号</view>
            <view class="data">{{item.site}}</view>
          </view>
        </view>
      </view>
    </block>
  </view>
  <empty wx:else msg="暂无考试信息">
  </empty>
</template>

<script>
  import wepy from "wepy";
  import Empty from "components/empty";
  import ExamMixin from "mixins/exam";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import DataMixin from "mixins/data";
  import db from "util/db"
  export default class Exam extends wepy.page {
    config = {
      navigationBarTitleText: '考试安排',
      enablePullDownRefresh: true
    };
    components = {
      empty: Empty,
    };
    mixins = [ExamMixin, HttpMixin, ToastMixin, DataMixin];
    data = {
      exams: []
    };
    methods = {
      active(i) {
        this.exams[i].active = !this.exams[i].active;
        this.$apply();
      }
    };
    async onPullDownRefresh() {
      try {
        await this.UpdateExam()
        await this.get()
      } catch (error) {
        console.log(error);
      }
      wepy.stopPullDownRefresh()
    }
    async get() {
      let exams = await this.GetExam();
      for (let i = 0; i < exams.length; i++) {
        const e = exams[i];
        const start = Date.parse(e.start_time);
        const now = new Date().getTime();
        if (start - now < 0) {
          exams[i].time_info = "已经考过啦";
          exams[i].t = -1
        } else {
          let hours = (start - now) / 1000 / 3600
          let days = Math.floor(hours / 24);
          hours = Math.floor(hours)
          exams[i].t = t
          if (t == 0) {
            exams[i].time_info = `还有不到${hours}小时考试`;
          } else {
            exams[i].time_info = `还有不到${t}天考试`;
          }
        }
        exams[i].active = false;
      }
      this.exams = exams;
      this.$apply();
      this.InitSet("exams", exams)
    }
    async onLoad() {
      this.Init("exams")
    }
  }
</script>
