<style lang="less">
  @import "./src/icon/iconfont.less";
  @import "./src/less/config.less";
  page {
    background: @bg-color;
  }
  .func {
    background: #fff;
    margin: 20rpx;
    margin-top: -40rpx;
    position: relative;
    border-radius: 10rpx;
    box-shadow: 0rpx 4rpx 10rpx #ddd;
    z-index: 999;
    .func-row {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      .login {
        &.no-verify {
          .iconfont {
            background: #ccc !important;
          }
        }
      }
    }
  }
  .mview {
    padding-top: 0.7rem;
    width: 25%;
    border-bottom: 1px solid #eee;
  }
  .icon-btn {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    flex-wrap: wrap; // width: 25%;
    .iconfont {
      box-shadow: 2rpx 2rpx 0rpx #eee;
      @size: 2.7rem;
      width: @size;
      border-radius: @size*0.5;
      height: @size;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #99ccee;
      color: #fff;
      font-size: 1.2rem;
    }
    text {
      width: 100%;
      display: block;
      margin-top: 5rpx;
      font-size: 0.8rem;
    }
  }
  .swiper {
    width: 100%;
    z-index: 99;
    top: 0;
    swiper-item {
      width: 100%;
    }
    image {
      z-index: 30;
      width: 100%;
    }
  }
  .ecard {
    display: flex;
    align-items: center;
    justify-content: center;
    color: @base-color;
    font-size: 70rpx;
    height: 150rpx;
    border-bottom: 2rpx dashed #fff;
  }
</style>

<template>
  <view>
    <!-- 公告区, 用于置放最新公告,头条新闻,推广消息 -->
    <swiper style="height: {{swiper_height}}px;" class="swiper"  autoplay="true" interval="4000" duration="1000">
      <block wx:for="{{notices}}" wx:key="{{index}}">
        <swiper-item >
          <image style="height: {{swiper_height}}px;" @tap="noticeTo({{item.id}})" src="{{item.cover}}" class="slide-image" />
        </swiper-item>
      </block>
    </swiper>
    <!-- 功能区 -->
    <view class="func">
      <view class="func-row">
        <repeat for="{{funcs}}" item="item" key="index">
          <mview @mtap.user="to" class="mview {{item.type}} {{verify === 1 ? '' : 'no-verify'}}" :arg.sync="item">
            <view class="icon-btn" slot="content">
              <view style="background: {{item.bg}};" class="iconfont icon-{{item.icon}}"></view>
              <text>{{item.name}}</text>
            </view>
          </mview>
        </repeat>
      </view>
    </view>
    <!-- 卡片区, 置放通知卡片, 例如: 成绩通知, 课程通知, 自习教室, 考试通知 -->
    <view wx:if="{{verify > 0}}">
      <schedule-card iconBg="#eacdd1" icon="kechengbiao" title="今日课表" bg="card-schedule.png" :isShow.sync="todaySchedules" footText="查看完整课表" url="/pages/schedule" noneText="今日无课">
        <block slot="content" wx:for="{{todaySchedules}}" wx:if="{{item.course_name}}" wx:key="{{index}}">
          <view class="card-list">
            <view class="card-left">
              <text class="class-name">{{item.course_name}}</text>
              <text class="class-info">{{item.sessionArr[0]}}~{{item.sessionArr[item.flex-1]}}</text>
            </view>
            <view class="card-right">
              <text>{{item.building}} {{item.classroom}}</text>
            </view>
          </view>
        </block>
      </schedule-card>
      <book-card iconBg="#ab96c5" icon="book" bg="card-library.png" title="我的借阅" :isShow.sync="loanBooks" footText="查看所有借阅" url="/pages/library/loan" noneText="无借阅书籍">
        <block slot="content" wx:for="{{loanBooks}}" wx:key="{{index}}">
          <view wx:if="{{item.title && index < 3}}" class="card-list">
            <view class="card-left">
              <text class="class-name">{{item.title}}</text>
            </view>
            <view class="card-right">
              <text>{{item.due_date}}</text>
            </view>
          </view>
        </block>
      </book-card>
      <ecard :isShow.sync="ecardBalance" footText="查看交易流水" icon="card" bg="card-ecard.png" title="一卡通余额" url="/pages/ecard" iconBg="#b92c18">
        <view class="ecard" slot="content">
          {{ecardBalance[0]}}
        </view>
      </ecard>
      <exam-card iconBg="#2578b5" bg="card-exam.png" icon="exam" title="考表" :isShow.sync="exams" footText="查看完整考表" url="/pages/exam" noneText="近期没有考试">
        <block slot="content" wx:for="{{exams}}" wx:key="{{index}}">
          <view class="card-list">
            <view class="card-left">
              <text class="class-name">{{item.course_name}}</text>
              <text class="class-info">time: {{item.date}} {{item.time}} site: {{item.site}}</text>
            </view>
            <view class="card-right">
              <text>{{item.building}} {{item.classroom}}</text>
            </view>
          </view>
        </block>
      </exam-card>
    </view>
    <empty wx:else msg="尚未绑定账号"></empty>
  </view>
</template>

<script>
  import wepy from 'wepy'
  import HttpMixin from "../mixins/http";
  import index from '../util/index/index'
  import MView from '../components/mview'
  import Card from '../components/card'
  import Empty from '../components/empty'
  import db from "../util/db"
  export default class Index extends wepy.page {
    config = {};
    components = {
      "mview": MView,
      "schedule-card": Card,
      "book-card": Card,
      "ecard": Card,
      "exam-card": Card,
      "empty": Empty
    }
    mixins = [HttpMixin]
    data = {
      notices: [{
        cover: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        id: 1
      }],
      funcs: index.funcs,
      swiper_height: 200,
    };
    computed = {
      verify() {
        return db.Get('verify')
      },
      ecardBalance() {
        const trans = db.Get("trans")
        if (trans.length > 0) {
          return [trans[0].balance]
        } else {
          return []
        }
      },
      exams() {
        let arr = db.Get("exams")
        let data = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].t >= 0) data.push(e)
        }
        return data
      },
      loanBooks() {
        return db.Get("loan_now")
      },
      todaySchedules() {
        let schedules = db.Get('schedules')
        if (!schedules) {
          return
        }
        const todaySchedule = []
        let today = new Date().getDay() || 7
        schedules[today].forEach(e => {
          if (e.course_name) {
            todaySchedule.push(e)
          }
        })
        return todaySchedule
      }
    }
    navigate(item) {
      let url = item.url
      if (item.type == 'login' && this.verify == 0) {
        wepy.showModal({
          title: '账号信息错误',
          content: '统一身份认证账号未绑定或密码错误！是否前往绑定？',
          success: function(res) {
            if (res.confirm) {
              wepy.navigateTo({
                url: 'bind'
              })
            }
          }
        })
        return
      }
      wepy.navigateTo({
        url: url
      })
    }
    methods = {
      noticeTo(id) {
        wepy.navigateTo({
          url: `details?id=${id}&&from=notice`
        })
      },
      to(item) {
        this.navigate(item)
      }
    };
    async getNotice() {
      const resp = await this.GET('/notices', {}, false)
      this.notices = resp.data
      this.$apply()
    }
    onLoad() {
      // 设置swipe高度 2:1
      this.swiper_height = wepy.getSystemInfoSync().windowWidth / 2
      this.getNotice()
      // this.notices = []
    }
    onShareAppMessage(options) {
      return {}
    }
  }
</script>
