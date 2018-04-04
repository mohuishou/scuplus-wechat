<style lang="less">
  @import "./src/less/config";
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
    background: #f5f5f5;
    view {
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
    &.title {
      display: flex;
      justify-content: center;
      background: #f5f5f5;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
      &:first-child {
        border-top: 1px solid #e0e0e0;
      }
    }
    &.item {
      font-size: 20rpx;
      height: 300rpx;
      color: #fefefe;
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
    color: #fff;
    background: @base-color;
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
        <view>一</view>
        <view>二</view>
        <view>三</view>
        <view>四</view>
        <view>五</view>
        <view>六</view>
        <view>日</view>
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
      <view class="title">第{{week}}周</view>
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
      week: 1,
      month: 1,
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
        this.week--;
        this.initData();
        this.initSchedules(this.scheduleItems);
      },
      next() {
        this.week++;
        this.initData();
        this.initSchedules(this.scheduleItems);
      },
      changeWeek(e) {
        this.week = e.detail.value - 0 + 1;
        this.initData();
        this.initSchedules(this.scheduleItems);
      }
    };
    async onLoad() {
      // 初始化数据
      this.initData();
      // 获取本学期开学时间
      await this.InitTerm();
      // 计算本周周次
      const now = new Date();
      this.month = now.getMonth() + 1;
      this.week = await this.GetWeek(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      );
      // 获取课程表数据
      await this.Init("scheduleItems", 24 * 30);
      // 渲染数据
      this.initSchedules(this.scheduleItems);
      // 获取今天星期几
      this.day = new Date().getDay() || 7;
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
      let colors = ["#009966", "#99CC99", "#0099CC", "#339999", "#FF9999"];
      const week = this.week;
      for (let e of schedules) {
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
          let ridx = Math.round(Math.random() * (colors.length - 1));
          e.color = colors[ridx];
          // 替换原矩阵值
          e.sessionArr.forEach(element => {
            this.schedules[e.day - 0][element - 1].flex = 0;
          });
          this.schedules[e.day - 0][e.sessionArr[0] - 1] = e;
        }
      }
    }
    initData() {
      // 初始化data
      this.schedules = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      ];
      // let title = ["一", "二", "三", "四", "五", "六", "日"];
      for (let i = 0; i < 7; i++) {
        let tmpData = [];
        for (let j = 0; j < 12; j++) {
          // if (j === 0) {
          //   // tmpData[j] = title[i];
          //   continue;
          // }
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


