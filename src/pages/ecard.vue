<style lang="less">
  page {
    background: #efefef;
  }
  .card {
    margin: 0 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 4rpx 4rpx 20rpx #a82413;
    background-image: url("https://scuplus.oss-cn-shenzhen.aliyuncs.com/ecard/1.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    .money {
      margin-top: -4rem;
      color: #fff;
      font-size: 2.3rem;
    }
  }
  .title {
    margin: 0.5rem 1rem;
    color: #888;
    font-size: 0.8rem;
  }
  .trans {
    border-radius: 0.5rem;
    box-shadow: 2rpx 2rpx 20rpx #ccc;
    margin: 0 1.5rem;
    font-size: 0.8rem;
    text-align: center;
    .thead.tr {
      background: #b92c18;
      color: #fff;
      border-bottom: none;
    }
    .tr {
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px dashed #ddd;
      color: #666;
      padding: 0.3rem;
      &:nth-last-child(1) {
        border-bottom: none;
      }
      view {
        &:nth-child(1) {
          flex: 2;
        }
        &:nth-child(2) {
          flex: 2;
        }
        flex: 1;
      }
    }
  }
</style>

<template>
  <view>
    <view class="title">
      余额
    </view>
    <view style="height: calc({{height}}px - 1.5rem);" class="card">
      <view class="money">
        ￥{{balance}}
      </view>
    </view>
    <view class="title">
      流水
    </view>
    <!-- 交易数据 -->
    <view class="trans table">
      <view class="tr thead">
        <view>时间</view>
        <view>地点</view>
        <view>消费</view>
        <view>余额</view>
      </view>
      <block wx:for="{{trans}}" wx:key="{{index}}">
        <view class="tr">
          <view>{{item.trans_time}}</view>
          <view>{{item.addr}}</view>
          <view>{{item.money}}</view>
          <view>{{item.balance}}</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
  import wepy from 'wepy'
  import EcardMixin from '../mixins/ecard'
  import HttpMixin from '../mixins/http'
  import ToastMixin from '../mixins/toast'
  import DataMixin from "../mixins/data";
  import db from "../util/db"
  export default class Ecard extends wepy.page {
    config = {
      navigationBarTitleText: '我的校园卡',
      navigationBarBackgroundColor: '#b92c18',
      enablePullDownRefresh: true
    }
    mixins = [EcardMixin, HttpMixin, ToastMixin, DataMixin]
    components = {}
    data = {
      height: 0,
      trans: []
    }
    computed = {
      balance() {
        if (this.trans.length > 0 && "balance" in this.trans[0]) {
          return this.trans[0].balance
        }
        return "无数据"
      }
    }
    async onPullDownRefresh() {
      try {
        await this.UpdateECard()
        await this.get()
      } catch (error) {
        console.log(error);
      }
      wepy.stopPullDownRefresh()
    }
    async get() {
      try {
        let trans = await this.GetECard();
        for (let i = 0; i < trans.length; i++) {
          trans[i].trans_time = new Date(trans[i].trans_time * 1000).toLocaleDateString()
        }
        this.trans = trans
        this.$apply()
        this.InitSet("trans", trans)
      } catch (error) {
        console.log(error);
      }
    }
    async onLoad() {
      this.height = wx.getSystemInfoSync().windowWidth / 1.6
      this.Init("trans")
    }
  }
</script>
