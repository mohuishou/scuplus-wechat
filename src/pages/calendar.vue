<style lang="less">
  @import "./src/icon/iconfont";
  @import "./src/less/config";
  .we-calendar {
    padding: 20rpx;
    .calendar {
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
        <view class="iconfont icon-arrow-left"></view>
        <view class="title">2018-1</view>
        <view class="iconfont icon-arrow-right"></view>
      </view>
      <!-- 日期格子 -->
      <view class="content">
        <block wx:for="{{monthDay}}" wx:key="{{index}}" wx:for-item="row">
          <view class="row">
            <block wx:for="{{row}}" wx:key="{{index}}" wx:for-index="i">
              <view class="">{{item}}</view>
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
  import wepy from 'wepy'
  import HttpMixin from 'mixins/http'
  import ToastMixin from 'mixins/toast'
  import db from 'util/db'
  export default class BindJwc extends wepy.page {
    config = {}
    mixins = [HttpMixin, ToastMixin]
    data = {
      year: 2018,
      month: 1,
      today: 2,
      monthDay: [
        ['周', '日', '一', '二', '三', '四', '五', '六'],
        ['']
      ]
    }
    /**
     * 获取本月一共有多少天
     * @returns {number}
     */
    getMonthDays() {
      return new Date(this.year, this.month, 0).getDate()
    }
    // 计算每月第一天是星期几
    getFirstDayOfWeek() {
      return new Date(Date.UTC(this.year, this.month - 1, 1)).getDay()
    }
    // 初始化当月数据
    init() {
      const firstDayWeek = this.getFirstDayOfWeek()
      const days = this.getMonthDays()
      // 计算每月第一周空白时间
      for (let i = 0; i < firstDayWeek; i++) {
        this.monthDay[this.monthDay.length - 1].push('')
      }
      // 填充每月时间
      for (let i = 1; i <= days; i++) {
        if (this.monthDay[this.monthDay.length - 1].length === 8) this.monthDay.push([''])
        let d = this.monthDay[this.monthDay.length - 1]
        d.push(i)
      }
      let d = this.monthDay[this.monthDay.length - 1]
      const len = 8 - d.length
      for (let i = 0; i < len; i++) d.push('')
    }
    onLoad() {
      this.init()
    }
  }
</script>
