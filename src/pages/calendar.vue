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
          view {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 90%;
            height: 90%;
            .iconfont {
              color: #888;
            }
            .today {
              background: @base-color;
              color: #fff;
              border-radius: 50%;
            }
          }
        }
      }
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
        <view class="title">{{year}}-{{month}}</view>
        <view @tap="next" class="iconfont icon-arrow-right"></view>
      </view>
      <!-- 日期格子 -->
      <view class="content">
        <block wx:for="{{monthDay}}" wx:key="{{index}}" wx:for-item="row">
          <view class="row">
            <block wx:for="{{row}}" wx:key="{{index}}" wx:for-index="i">
              <view class="">
                <view wx:if="{{item.events.length > 0}}" class="iconfont icon-dian"></view>
                <view class="{{(today.year == year && today.day == item.name && month == today.month) ? 'today' : ''}}">{{item.name}}</view>
              </view>
            </block>
          </view>
        </block>
      </view>
    </view>
    <!-- 事件 -->
    <view>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db";
  export default class BindJwc extends wepy.page {
    config = {};
    mixins = [HttpMixin, ToastMixin];
    data = {
      year: 2018,
      month: 1,
      today: {
        day: 6,
        month: 1,
        year: 2018,
      },
      monthDay: [
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
        [""]
      ]
    };
    methods = {
      prev() {
        if (this.month == 1) {
          this.month = 12
          this.year--
        } else {
          this.month--
        }
        this.init()
      },
      next() {
        if (this.month == 12) {
          this.month = 1
          this.year++
        } else {
          this.month++
        }
        this.init()
      }
    }
    // 获取本月一共有多少天
    getMonthDays() {
      return new Date(this.year, this.month, 0).getDate();
    }
    // 计算每月第一天是星期几
    getFirstDayOfWeek() {
      return new Date(Date.UTC(this.year, this.month - 1, 1)).getDay();
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
        [""]
      ];
      const firstDayWeek = this.getFirstDayOfWeek();
      const days = this.getMonthDays();
      const empty = {
        name: "",
        events: []
      };
      // 计算每月第一周空白时间
      for (let i = 0; i < firstDayWeek; i++) {
        this.monthDay[this.monthDay.length - 1].push(empty);
      }
      // 填充每月时间
      for (let i = 1; i <= days; i++) {
        if (this.monthDay[this.monthDay.length - 1].length === 8) {
          this.monthDay.push([empty]);
        }
        let d = this.monthDay[this.monthDay.length - 1];
        d.push({
          name: i,
          events: []
        });
      }
      let d = this.monthDay[this.monthDay.length - 1];
      const len = 8 - d.length;
      for (let i = 0; i < len; i++) d.push(empty);
    }
    onLoad() {
      this.today.year = new Date().getFullYear()
      this.today.day = new Date().getDate()
      this.today.month = new Date().getMonth() + 1
      this.init();
    }
  }
</script>
