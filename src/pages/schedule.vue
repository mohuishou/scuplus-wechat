<style lang="less">
  @import "./src/less/config";
  @tab-bg: #f5f5f5;
  page {
    width: 100%;
    height: 100%;
    background: @bg-color;
  }
  scroll-view {
    width: 100%;
    height: 2000rpx;
    margin-bottom: 80rpx;
    padding-top: 80rpx;
  }
  .contanier {
    display: flex;
    width: auto;
    height: 100%;
  }
  .header {
    position: fixed;
    display: flex;
    width: 100%;
    top: 0;
    font-size: 28rpx;
    background: @tab-bg;
    .time {
      flex-wrap: wrap;
      view {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &.day {
          font-size: 24rpx;
          margin-top: 5rpx;
        }
        &.date {
          font-size: 22rpx;
          color: #888;
          margin-bottom: 5rpx;
        }
      }
    }
    >view {
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #e0e0e0;
      height: 80rpx;
      flex: 2;
    }
    .title {
      flex: 1;
      font-size: 24rpx;
    }
  }
  .col {
    display: flex;
    height: 100%;
    flex-direction: column;
    flex: 2;
    &.title {
      flex: 1;
    }
    flex-wrap: wrap;
  }
  .row {
    text-align: center;
    flex: 1;
    padding: 0 0.15rem;
    border-bottom: 1px solid @bg-color;
    &.title {
      display: flex;
      justify-content: center;
      background: @tab-bg;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
      &:first-child {
        border-top: 1px solid #e0e0e0;
      }
    }
    &.item {
      font-size: 20rpx;
      height: 300rpx;
      color: #fff;
      display: flex;
      flex-direction: column;
      view {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .course-name {
        padding-top: 10rpx;
        padding-bottom: 10rpx;
      }
    }
  }
  .tabs {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 80rpx;
    width: 100%;
    color: #555;
    background: @tab-bg;
    .iconfont {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100rpx;
      height: 100%;
    }
  }
</style>

<template>
  <scroll-view scroll-x scroll-into-view="day-{{day}}">
    <view class="contanier">
      <view class="header">
        <view class="title">{{month}}月</view>
        <block wx:for="{{headers}}" wx:key="{{index}}">
          <view class="time">
            <view class="day">周{{item.day}}</view>
            <view class="date">{{item.date}}日</view>
          </view>
        </block>
      </view>
      <block wx:for="{{schedules}}" wx:key="{{index}}" wx:for-item="items" wx:for-index="i">
        <view class="col {{i==0 ? 'title' : ''}}" id="day-{{i}}">
          <block wx:for="{{items}}" wx:key="{{j}}" wx:for-item="item" wx:for-index="j">
            <view class="row title" wx:if="{{i == 0}}">{{item}}</view>
            <view class="row" style="flex: {{item.flex}};" wx:elif="{{item.flex == 1 && item.course_name == ''}}"></view>
            <view class="row item" style="flex: {{item.flex}}; padding-bottom: {{item.flex-1}}px; background: {{item.color}};" wx:elif="{{item.flex > 0}}">
              <view class="course-name">{{item.course_name}}</view>
              <view class="address">@{{item.building}} {{item.classroom}}</view>
            </view>
          </block>
        </view>
      </block>
    </view>
  </scroll-view>
  <view class="tabs">
    <view @tap="prev" class="iconfont icon-arrow-left"></view>
    <picker @change="changeWeek" value="{{week-1}}" mode="selector" range="{{allWeeks}}">
      <view class="title" wx:if="{{week == nowWeek}}">本周课表(第{{week}}周)</view>
      <view class="title" wx:else>第{{week}}周</view>
    </picker>
    <view @tap="next" class="iconfont icon-arrow-right"></view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import DataMixin from "mixins/data";
  import db from "util/db";
  import TermMixin from "mixins/term";
  export default class Schedule extends wepy.page {
    config = {
      navigationBarTitleText: "我的课表",
      enablePullDownRefresh: true,
      // navigationBarBackgroundColor: "#f8f8f5"
    };
    mixins = [HttpMixin, ToastMixin, DataMixin, TermMixin];
    components = {};
    data = {
      schedules: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      ],
      day: 0,
      scheduleItems: [],
      week: 1, // 当前选择周次
      nowWeek: 2, // 本周
      month: 1,
      headers: [],
      allWeeks: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ]
    };
    methods = {
      prev() {
        this.ChangeWeek(this.week - 1)
      },
      next() {
        this.ChangeWeek(this.week + 1)
      },
      changeWeek(e) {
        this.ChangeWeek(e.detail.value - 0 + 1)
      }
    };
    ChangeWeek(week) {
      this.week = week;
      this.initData();
      this.initHeaders()
      this.initSchedules(this.scheduleItems);
    }
    initHeaders() {
      let current = this.GetDate(this.week)
      this.month = current.getMonth() + 1
      this.headers = []
      for (let i = 0; i < 7; i++) {
        this.headers.push({
          day: ["日", "一", "二", "三", "四", "五", "六"][current.getDay()],
          date: current.getDate()
        })
        current.setDate(current.getDate() + 1)
      }
      this.$apply()
    }
    async onLoad() {
      // 初始化数据
      this.initData();
      // 获取本学期开学时间
      await this.InitTerm();
      // 计算本周周次
      const now = new Date();
      this.month = now.getMonth() + 1;
      let week = await this.GetWeek(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      );
      this.week = week
      this.nowWeek = week
      // 获取课程表数据
      await this.Init("scheduleItems", 24 * 30);
      // 渲染数据
      this.initSchedules(this.scheduleItems);
      // 获取今天星期几
      this.day = new Date().getDay() || 7;
      this.initHeaders()
      this.$apply();
      const update_time = db.Get("update_time." + "schedules") || 0;
      if ((now.getTime() - update_time) / 1000 / 3600 > 3 * 24) {
        this.InitSet("schedules", this.schedules);
      }
    }
    async get() {
      const resp = await this.GetWithBind("/user/schedule", {
        term: 1
      });
      this.scheduleItems = resp.data;
      this.$apply();
      this.InitSet("scheduleItems", resp.data);
    }
    async onPullDownRefresh() {
      try {
        await this.PostWithBind("/user/schedule", {
          term: 1
        });
        await this.get();
        await this.initData();
        await this.initSchedules(this.scheduleItems);
        this.$apply();
        this.InitSet("schedules", this.schedules);
      } catch (error) {
        console.log(error);
      }
      wepy.stopPullDownRefresh();
    }
    initSchedules(schedules) {
      let colors = ["#f07c82", "#66CC99", "#ea7293", "#13afc8", "#FF9999", "#99CCFF", "#f97d1c", "#FF6666", "#21a265"];
      const week = this.week;
      let ci = 0;
      for (let e of schedules) {
        ci++
        e.flex = 0;
        e.sessionArr = [];
        if (e.session !== "") {
          e.sessionArr = e.session.split(",");
          e.flex = e.sessionArr.length;
        }
        // 判断是否为本周课程
        let thisWeek = false;
        if (e.allWeek != "") {
          const arr = e.all_week.split(",");
          arr.forEach(el => {
            if (el == week) thisWeek = true;
          });
        }
        if (thisWeek) {
          // 生成随机背景色
          e.color = colors[ci % colors.length];
          // 替换原矩阵值
          e.sessionArr.forEach(element => {
            this.schedules[(e.day % 7) + 1][element - 1].flex = 0;
          });
          this.schedules[(e.day % 7) + 1][e.sessionArr[0] - 1] = e;
        }
      }
    }
    initData() {
      // 初始化data
      this.schedules = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      ];
      for (let i = 0; i < 7; i++) {
        let tmpData = [];
        for (let j = 0; j < 12; j++) {
          tmpData[j] = {
            course_name: "",
            flex: 1
          };
        }
        this.schedules.push(tmpData);
      }
    }
  }
</script>


