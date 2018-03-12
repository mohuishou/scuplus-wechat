<style lang="less">
  @import './src/less/config';
  page {
    width: 100%;
    height: 100%;
  }
  scroll-view {
    width: 100%;
    height: calc(~"100% - 80rpx");
  }
  .contanier {
    display: flex;
    width: auto;
    height: 100%;
  }
  .col {
    display: flex;
    height: 100%;
    flex-direction: column;
    min-width: 180rpx;
    &.title {
      min-width: 80rpx;
    }
    flex-wrap: wrap;
  }
  .row {
    text-align: center;
    flex: 1; // height: 150rpx;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
    background: #fff;
    padding: 0 0.15rem;
    &.title {
      // height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.item {
      font-size: 0.7rem;
      height: 2rem;
      color: #fefefe;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      text {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .course-name {
        padding-bottom: 0.5rem;
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
      <block wx:for="{{schedules}}" wx:key="{{index}}" wx:for-item="items" wx:for-index="i">
        <view class="col {{i==0 ? 'title' : ''}}" id="day-{{i}}">
          <block wx:for="{{items}}" wx:key="{{j}}" wx:for-item="item" wx:for-index="j">
            <view class="row title" wx:if="{{i == 0 || j==0}}">{{item}}</view>
            <view class="row" style="flex: {{item.flex}};" wx:elif="{{item.flex == 1 && item.course_name == ''}}"></view>
            <view class="row item" style="flex: {{item.flex}}; padding-bottom: {{item.flex-1}}px; background: {{item.color}};" wx:elif="{{item.flex > 0}}">
              <text class="course-name">{{item.course_name}}</text>
              <text class="address">
                                                                    <text>{{item.building}}</text>
              <text>{{item.classroom}}</text>
              </text>
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
  import wepy from 'wepy'
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import DataMixin from "mixins/data";
  import db from "util/db"
  import TermMixin from "mixins/term";
  export default class Schedule extends wepy.page {
    config = {
      navigationBarTitleText: '我的课表',
      enablePullDownRefresh: true
    };
    mixins = [HttpMixin, ToastMixin, DataMixin, TermMixin];
    components = {}
    data = {
      schedules: [
        ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      ],
      day: 0,
      scheduleItems: [],
      week: 1,
      allWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    };
    methods = {
      prev() {
        this.week--;
        this.initData()
        this.initSchedules(this.scheduleItems);
      },
      next() {
        this.week++;
        this.initData()
        this.initSchedules(this.scheduleItems);
      },
      changeWeek(e) {
        this.week = e.detail.value - 0 + 1;
        this.initData()
        this.initSchedules(this.scheduleItems);
      }
    }
    async onLoad() {
      this.initData()
      await this.InitTerm()
      const now = new Date()
      this.week = await this.GetWeek(now.getFullYear(), now.getMonth() + 1, now.getDate())
      await this.Init("scheduleItems", 24 * 30)
      this.initSchedules(this.scheduleItems)
      this.day = (new Date()).getDay() || 7
      this.$apply()
    }
    async get() {
      const resp = await this.GetWithBind('/user/schedule', {
        term: 1
      })
      this.scheduleItems = resp.data
      this.$apply()
      this.InitSet("scheduleItems", resp.data)
    }
    async onPullDownRefresh() {
      try {
        await this.PostWithBind('/user/schedule', {
          term: 1
        })
        await this.get()
        await this.initData()
        await this.initSchedules(this.scheduleItems)
        this.$apply()
      } catch (error) {
        console.log(error);
      }
      wepy.stopPullDownRefresh()
    }
    initSchedules(schedules) {
      let colors = ['#009966', '#99CC99', '#0099CC', '#339999', '#FF9999']
      const week = this.week
      for (let e of schedules) {
        e.flex = 0
        e.sessionArr = []
        if (e.session !== '') {
          e.sessionArr = e.session.split(',')
          e.flex = e.sessionArr.length
        }
        // 判断是否为本周课程
        let thisWeek = false
        if (e.allWeek != '') {
          const arr = e.all_week.split(',')
          arr.forEach(el => {
            if (el == week) thisWeek = true
          })
        }
        if (thisWeek) {
          // 生成随机背景色
          let ridx = Math.round(Math.random() * (colors.length - 1))
          e.color = colors[ridx]
          // 替换原矩阵值
          e.sessionArr.forEach(element => {
            this.schedules[e.day - 0][element].flex = 0
          })
          this.schedules[e.day - 0][e.sessionArr[0]] = e
        }
      }
    }
    initData() {
      // 初始化data
      this.schedules = [
        ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      ]
      let title = ['一', '二', '三', '四', '五', '六', '日']
      for (let i = 0; i < 7; i++) {
        let tmpData = []
        for (let j = 0; j < 13; j++) {
          if (j === 0) {
            tmpData[j] = title[i]
            continue
          }
          tmpData[j] = {
            course_name: '',
            flex: 1
          }
        }
        this.schedules.push(tmpData)
      }
    }
  }
</script>


