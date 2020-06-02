<style lang="less">
  @border: 1px solid #eee;
  .icon(@size, @font-size, @background) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: @size;
    height: @size;
    background: @background;
    border-radius: @size*0.5rem;
    color: #fff;
    font-size: @font-size;
  }
  .card._7h9jrf {
    background: #fff;
    margin: 20rpx;
    box-shadow: 4rpx 4rpx 10rpx #ddd;
    border-radius: 10rpx;
    background-position: center;
    background-size: cover;
    padding: 0.3rem;
    padding-bottom: 0;
    .only {
      text-align: center;
      color: #999;
      font-size: 1.5rem;
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-title {
      display: flex;
      align-items: baseline;
      padding-bottom: 0.3rem;
      border-bottom: @border;
      .iconfont {
        margin-left: 0.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        @size: 1.3rem;
        width: @size;
        height: @size;
        background: #99ccee;
        border-radius: @size*0.5rem;
        color: #fff;
        font-size: 0.7rem;
      }
      text {
        margin-left: 0.2rem;
        font-size: 0.7rem;
        color: #888;
      }
    }
    .card-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed #eee;
      padding-bottom: 0.4rem;
      text {
        color: #666;
        font-size: 0.8rem;
      }
      .card-left {
        display: inline-block;
        text-align: center;
        text {
          display: block;
          padding-top: 0.3rem;
          &.class-info {
            color: #999;
            font-size: 0.7rem;
          }
        }
      }
    }
    .card-foot {
      text-align: center;
      padding: 0.3rem;
      font-size: 0.8rem;
      color: #666;
    }
  }
</style>

<template>
  <view class="card _7h9jrf" style="background-image: url(https://scuplus.oss-cn-shenzhen.aliyuncs.com/{{bg}});">
    <view class="card-title">
      <view class="iconfont icon-{{icon}}" style="background: {{iconBg}};"></view>
      <text>{{title}}</text>
    </view>
    <view wx:if="{{isShow.length > 0}}" class="card-lists">
      <slot name="content"></slot>
    </view>
    <view wx:if="{{isShow.length > 0}}" @tap="to" class="card-foot">
      <text>{{footText}}</text>
    </view>
    <view wx:else class="only">
      <text>{{noneText}}</text>
    </view>
  </view>
</template>

<script>
  import wepy from 'wepy'
  export default class Card extends wepy.component {
    props = {
      icon: String,
      title: String,
      isShow: Array,
      url: String,
      iconBg: {
        type: String,
        default: '#99ccee'
      },
      noneText: {
        type: String,
        default: '暂无数据'
      },
      footText: {
        type: String,
        default: '点击查看'
      },
      bg: {
        type: String,
        default: 'card-kb.png'
      }
    }
    methods = {
      to() {
        wepy.navigateTo({
          url: this.url
        })
      }
    }
  }
</script>
