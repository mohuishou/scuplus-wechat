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
  > view {
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
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  width: calc(~"100% - 90rpx");
  color: #555;
  background: @tab-bg;
  padding-left: 60rpx;
  padding-right: 30rpx;
  .iconfont {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100rpx;
    height: 100%;
  }
  .icon-add {
    font-size: 40rpx;
  }
}
</style>

<template>
  <view>
    <scroll-view @touchstart="moveStart" @touchend="moveEnd" scroll-x scroll-into-view="day-{{day}}">
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
              <view @tap="toCourseDetail({{item.course_id}},{{item.lesson_id}})" class="row item" style="flex: {{item.flex}}; padding-bottom: {{item.flex-1}}px; background: {{item.color}};" wx:elif="{{item.flex > 0}}">
                <view class="course-name">{{item.course_name}}</view>
                <view class="address">
                  @{{item.address}}
                </view>
              </view>
            </block>
          </view>
        </block>
      </view>
    </scroll-view>
    <view class="tabs">
      <picker @change="changeWeek" value="{{week-1}}" mode="selector" range="{{allWeeks}}">
        <view class="title" wx:if="{{week == nowWeek}}">第{{week}}周(本周)</view>
        <view class="title" wx:else>第{{week}}周</view>
      </picker>
      <picker mode="multiSelector" @change="changeYearTerm" value="{{year_terms_val}}" range="{{year_terms}}">
        <view wx:if="{{params.year && params.year >= year_terms[0][0]}}">
          {{year_terms[0][year_terms_val[0]]}}年{{year_terms[1][year_terms_val[1]]}}
        </view>
        <view wx:else>
          学期设置
        </view>
      </picker>
      <view @tap="add" class="iconfont icon-add"></view>
    </view>
  </view>

</template>

<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import DataMixin from "mixins/data";
import MoveMixin from "mixins/move";
import db from "util/db";
import TermMixin from "mixins/term";
let years = [];
const now_year = new Date().getFullYear();
for (let i = -2; i <= 2; i++) {
  years.push(now_year + i);
}
export default class Schedule extends wepy.page {
  config = {
    navigationBarTitleText: "我的课表",
    enablePullDownRefresh: true
  };
  mixins = [HttpMixin, ToastMixin, DataMixin, TermMixin, MoveMixin];
  components = {};
  computed = {
    isGraduate() {
      return db.Get("user_type") == 1;
    }
  };
  data = {
    year_terms: [years, ["秋", "春"]],
    year_terms_val: [2, 0],
    schedules: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]],
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
    ],
    params: {
      year: 0,
      term: 0
    }
  };
  methods = {
    changeYearTerm(e) {
      this.year_terms_val = e.detail.value;
      this.params.year = this.year_terms[0][this.year_terms_val[0]];
      this.params.term = this.year_terms_val[1];
      db.Set("year_term", this.params);
      this.getAndInit();
    },
    toCourseDetail(course_id, lesson_id) {
      if (course_id && this.isGraduate) {
        return;
      }
      if (!course_id || !lesson_id) {
        this.ShowToast("不存在该课程！");
        return;
      }
      let items = db.Get("myScheduleItems") || [];
      const self = this;
      if (course_id < 0 && lesson_id < 0) {
        wepy.showModal({
          title: "确认删除", //提示的标题
          content: "是否从我的课表删除该门课程", //提示的内容
          showCancel: true, //是否显示取消按钮
          success: res => {
            if (res.confirm) {
              for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (
                  item.course_id == course_id &&
                  item.lesson_id == lesson_id
                ) {
                  items.splice(i, 1);
                }
              }
              db.Set("myScheduleItems", items);
              self.ShowToast("删除成功！");
              self.initData();
              self.initHeaders();
              self.initSchedules(self.scheduleItems);
              self.$apply();
            }
          }
        });
        return;
      }
      wepy.navigateTo({
        url:
          "/pages/course/details?course_id=" +
          course_id +
          "&lesson_id=" +
          lesson_id
      });
    },
    add() {
      if (this.isGraduate) {
        wepy.navigateTo({ url: "/pages/addSchedule" });
        return;
      }
      wepy.navigateTo({
        url: "/pages/course/search?from=add"
      });
    },
    changeWeek(e) {
      this.ChangeWeek(e.detail.value - 0 + 1);
    }
  };
  moveRight() {
    this.ChangeWeek(this.week - 1);
  }
  moveLeft() {
    this.ChangeWeek(this.week + 1);
  }
  ChangeWeek(week) {
    if (week < 1 || week > 25) {
      return;
    }
    this.week = week;
    this.initData();
    this.initHeaders();
    this.initSchedules(this.scheduleItems);
  }
  initHeaders() {
    let current = this.GetDate(this.week);
    this.month = current.getMonth() + 1;
    this.headers = [];
    for (let i = 0; i < 7; i++) {
      this.headers.push({
        day: ["日", "一", "二", "三", "四", "五", "六"][current.getDay()],
        date: current.getDate()
      });
      current.setDate(current.getDate() + 1);
    }
    this.$apply();
  }

  async getAndInit() {
    await this.get();
    await this.initData();
    await this.initSchedules(this.scheduleItems);
    this.$apply();
    this.InitSet("schedules", this.schedules);
  }

  async get() {
    if (this.isGraduate) {
      await this.graduateGet();
    } else {
      await this.getSchedule();
    }
  }
  async getSchedule() {
    if (!this.checkParams()) return;
    const resp = await this.GET("/user/schedule", this.params);
    this.scheduleItems = resp.data;
    this.$apply();
    this.InitSet("scheduleItems", resp.data);
  }
  async graduateGet() {
    try {
      if (!this.checkParams()) return;
      const resp = await this.GET("/graduate/schedule", this.params);
      this.scheduleItems = resp.data;
      this.$apply();
      this.InitSet("scheduleItems", resp.data);
    } catch (error) {
      console.log(error);
    }
  }
  async graduateUpdate() {
    try {
      if (!this.checkParams()) return;
      await this.POST("/graduate/schedule", this.params);
    } catch (error) {
      console.log(error);
    }
  }
  async updateSchedules() {
    try {
      if (!this.checkParams()) return;
      await this.POST("/user/schedule", this.params);
    } catch (error) {
      console.log(error);
    }
  }

  showModal() {
    const self = this;
    return new Promise((resolve, reject) => {
      wepy.showModal({
        title: "提示", //提示的标题,
        content: `确认要更新${self.params.year}年${
          self.params.term === 0 ? "秋" : "春"
        }的课程表么`, //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#000000", //取消按钮的文字颜色,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: function(res) {
          if (res.confirm) {
            resolve();
          } else {
            reject();
          }
        }
      });
    });
  }

  async onPullDownRefresh() {
    try {
      await this.showModal();
      if (this.isGraduate) {
        await this.graduateUpdate();
      } else {
        await this.updateSchedules();
      }
      await this.getAndInit()
    } catch (error) {
      console.error(error);
    }
    wepy.stopPullDownRefresh();
    wepy.redirectTo({ url: '/pages/schedule' });
  }
  initSchedules(schedules) {
    const myScheduleItems = db.Get("myScheduleItems") || [];
    schedules = schedules.concat(myScheduleItems);
    let colors = [
      "#f07c82",
      "#66CC99",
      "#ea7293",
      "#13afc8",
      "#FF9999",
      "#99CCFF",
      "#f97d1c",
      "#FF6666",
      "#21a265"
    ];
    const week = this.week;
    let ci = 0;
    for (let e of schedules) {
      ci++;
      e.flex = 0;
      e.sessionArr = [];
      if (e.session !== "") {
        e.sessionArr = e.session.split(",");
        e.flex = e.sessionArr.length;
        if (!('address') in e ) {
          e.address = e.campus + e.building + e.classroom
        }
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
          this.schedules[e.day % 7 + 1][element - 1].flex = 0;
        });

        this.schedules[e.day % 7 + 1][e.sessionArr[0] - 1] = e;
      }
    }
  }
  initData() {
    // 初始化data
    this.schedules = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]];
    for (let i = 0; i < 7; i++) {
      let tmpData = [];
      for (let j = 0; j < 13; j++) {
        tmpData[j] = {
          course_name: "",
          flex: 1
        };
      }
      this.schedules.push(tmpData);
    }
  }

  checkParams() {
    if ("year" in this.params && this.params.year >= years[0]) return true;
    // 没有设置学年学期报错
    wepy.showModal({
      title: "学期错误！", //提示的标题,
      content: "请点击页面下方设置按钮，设置学期", //提示的内容,
      showCancel: false, //是否显示取消按钮,
      confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
      success: res => {}
    });
    return false;
  }

  async onLoad() {
    // 初始化参数
    this.params = db.Get("year_term") || this.params;
    if (this.checkParams()) {
      this.year_terms_val[0] = this.params.year - years[0];
      this.year_terms_val[1] = this.params.term;
    }
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
    this.week = week;
    this.nowWeek = week;
    // 获取课程表数据
    await this.Init("scheduleItems", 24 * 30);
    // 渲染数据
    this.initSchedules(this.scheduleItems);
    // 获取今天星期几
    this.day = new Date().getDay() || 7;
    this.initHeaders();
    this.$apply();
    const update_time = db.Get("update_time." + "schedules") || 0;
    if ((now.getTime() - update_time) / 1000 / 3600 > 3 * 24) {
      this.InitSet("schedules", this.schedules);
    }
  }
}
</script>


