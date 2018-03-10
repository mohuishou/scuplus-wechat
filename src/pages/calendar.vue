<style lang="less">
  @import "./src/icon/iconfont";
  @import "./src/less/config";
  page {
    background: @bg-color;
  }
  .we-calendar {
    .calendar {
      padding: 20rpx;
      background: #fff;
      .header {
        color: #666;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          color: #333;
        }
      }
      .content {
        .row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          &:nth-child(1) {
            color: #666666;
            font-size: 28rpx;
          }
          height: 90rpx;
          .day {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 87rpx;
            border: 2rpx solid #fff;
            .iconfont {
              color: #888;
              position: absolute;
              margin-top: -30rpx;
            }
            &:nth-child(1) {
              color: #666666;
            }
            &.current {
              background: #efefef;
              border: 2rpx solid #ddd;
              border-radius: 50%;
            }
            &.today {
              background: @base-color;
              color: #fff;
              border-radius: 50%;
              .iconfont {
                color: @base-color;
              }
            }
          }
        }
      }
    }
    .events {
      .event {
        padding: 20rpx;
        background: #fff;
        margin-top: 20rpx;
        .info {
          font-size: 28rpx;
          color: #888;
        }
      }
    }
    .return {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50rpx;
      color: #fff;
      background: @base-color;
      bottom: 20rpx;
      right: 20rpx;
    }
  }
</style>

<template>
  <view class="we-calendar">
    <!-- 日历 -->
    <view class="calendar">
      <!-- title eg. 2018-1 -->
      <view class="header">
        <view @tap="prev" class="iconfont icon-arrow-left"></view>
        <picker value="{{current.year+'-'+current.month}}" mode="date" start="2000-01-01" end="2050-12-31" @change="updateCurrent" fields="month">
          <view class="title">{{current.year}}-{{current.month}}</view>
        </picker>
        <view @tap="next" class="iconfont icon-arrow-right"></view>
      </view>
      <!-- 日期格子 -->
      <view class="content">
        <block wx:for="{{monthDay}}" wx:key="{{index}}" wx:for-item="row">
          <view class="row">
            <block wx:for="{{row}}" wx:key="{{index}}" wx:for-index="i">
              <view class="day {{(today.year == current.year && today.day == item.name && current.month == today.month) ? 'today' : ''}} {{(current.day == item.name && i !=0 && item.name != '' ) ? 'current' : ''}}" @tap="currentDay({{item}},{{i}},{{index}})">
                <view wx:if="{{item.events.length > 0}}" class="iconfont icon-dian"></view>
                <view class="">{{item.name}}</view>
              </view>
            </block>
          </view>
        </block>
      </view>
    </view>
    <!-- 事件 -->
    <view class="events" wx:if="{{current.day != 0}}">
      <view class="event">
        <view class="title">{{current.year}}年{{current.month}}月{{current.day}}日</view>
        <view class="info">{{termName}}</view>
      </view>
      <block wx:for="{{event}}" wx:key="{{index}}">
        <view class="event">
          <view class="title">{{item.name}}</view>
          <view class="info">{{item.start_time}} ~ {{item.end_time}}</view>
        </view>
      </block>
    </view>
    <view @tap="returnToday" class="return" wx:if="{{today.year != current.year || today.day != current.day || current.month != today.month}}">
      今
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db";
  import DataMixin from "mixins/data";
  export default class BindJwc extends wepy.page {
    config = {
      navigationBarTitleText: '校历',
    };
    mixins = [HttpMixin, ToastMixin, DataMixin];
    data = {
      current: {
        year: 2018,
        month: 1,
        day: 1,
      },
      today: {
        day: 6,
        month: 1,
        year: 2018,
      },
      monthDay: [],
      term: {},
      events: {},
      event: []
    };
    computed = {
      termName() {
        if (!this.term) return "本学期数据获取错误！"
        const start = new Date(this.term.start_time)
        const end = new Date(this.term.end_time)
        const now = new Date(this.current.year, this.current.month - 1, this.current.day)
        if (now.getTime() < start.getTime() || now.getTime() > end.getTime()) {
          return "假期ing,浪～"
        }
        return this.term.name
      }
    }
    methods = {
      returnToday() {
        this.current.day = this.today.day
        this.current.year = this.today.year
        this.current.month = this.today.month
        this.event = this.events[`${this.current.year}-${this.current.month}-${this.current.day}`] || []
        this.init()
      },
      updateCurrent(e) {
        const arr = e.detail.value.split("-")
        if (arr.length != 2) return
        this.current.year = arr[0]
        this.current.month = arr[1] - 0
        this.current.day = 0
        this.init()
      },
      prev() {
        if (this.current.month == 1) {
          this.current.month = 12
          this.current.year--
        } else {
          this.current.month--
        }
        this.current.day = 0
        this.init()
      },
      next() {
        if (this.current.month == 12) {
          this.current.month = 1
          this.current.year++
        } else {
          this.current.month++
        }
        this.current.day = 0
        this.init()
      },
      currentDay(item, i, j) {
        if (i === 0 || j === 0 || !item.name) return
        this.event = item.events
        this.current.day = item.name
      }
    }
    // 获取本月一共有多少天
    getMonthDays() {
      return new Date(this.current.year, this.current.month, 0).getDate();
    }
    // 计算每月第一天是星期几
    getFirstDayOfWeek() {
      return new Date(Date.UTC(this.current.year, this.current.month - 1, 1)).getDay();
    }
    async get() {
      try {
        const resp = await this.GET("/term/events")
        this.term = resp.data.term
        resp.data.events.forEach(e => {
          let start = new Date(e.start_time)
          let end = new Date(e.end_time)
          let day = (end.getTime() - start.getTime()) / 1000 / 3600 / 24
          day = Math.ceil(day)
          let y = start.getFullYear()
          let m = start.getMonth() + 1
          let d = start.getDate()
          for (let i = 0; i < day; i++) {
            let key = `${y}-${m}-${d}`
            if (!(key in this.events)) this.events[key] = []
            e.start_time = start.toLocaleDateString()
            e.end_time = end.toLocaleDateString()
            this.events[key].push(e)
            if (d < new Date(y, m, 0).getDate()) {
              d++
            } else {
              d = 1
              if (m == 12) {
                m = 1
                y++
              } else {
                m
              }
            }
          }
        });
        this.$apply()
        this.InitSet("term", this.term)
        this.InitSet("events", this.events)
      } catch (error) {
        console.log(error);
      }
    }
    // 计算周次
    getWeek(year, month, day) {
      const start = new Date(this.term.start_time)
      const end = new Date(this.term.end_time)
      const now = new Date(year, month - 1, day)
      if (now.getTime() < start.getTime() || now.getTime() > end.getTime()) {
        return 0
      }
      return Math.floor((now.getTime() - start.getTime()) / 1000 / 3600 / 24 / 7) + 1
    }
    // 初始化当月数据
    init() {
      // 初始话monthday
      this.monthDay = [
        [{
            name: "周",
            events: []
          },
          {
            name: "日",
            events: []
          },
          {
            name: "一",
            events: []
          },
          {
            name: "二",
            events: []
          },
          {
            name: "三",
            events: []
          },
          {
            name: "四",
            events: []
          },
          {
            name: "五",
            events: []
          },
          {
            name: "六",
            events: []
          }
        ],
        []
      ];
      const firstDayWeek = this.getFirstDayOfWeek();
      const days = this.getMonthDays();
      const empty = {
        name: "",
        events: []
      };
      this.monthDay[this.monthDay.length - 1].push({
        name: this.getWeek(this.current.year, this.current.month, 1) || '',
        events: []
      });
      // 计算每月第一周空白时间
      for (let i = 0; i < firstDayWeek; i++) {
        this.monthDay[this.monthDay.length - 1].push(empty);
      }
      // 填充每月时间
      for (let i = 1; i <= days; i++) {
        if (this.monthDay[this.monthDay.length - 1].length === 8) {
          this.monthDay.push([{
            name: this.getWeek(this.current.year, this.current.month, i) || '',
            events: []
          }]);
        }
        let d = this.monthDay[this.monthDay.length - 1];
        d.push({
          name: i,
          events: this.events[`${this.current.year}-${this.current.month}-${i}`] || []
        });
      }
      let d = this.monthDay[this.monthDay.length - 1];
      const len = 8 - d.length;
      for (let i = 0; i < len; i++) d.push(empty);
      this.$apply()
    }
    async onLoad() {
      await this.Init("events", 24 * 30)
      this.term = db.Get("term")
      this.current.year = this.today.year = new Date().getFullYear()
      this.current.day = this.today.day = new Date().getDate()
      this.current.month = this.today.month = new Date().getMonth() + 1
      this.init();
    }
  }
</script>
