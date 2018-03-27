<style lang="less">
  @base-color: #f06292;
  .tag-tabs {
    width: 100%;
    height: 80rpx;
    position: fixed;
    top: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20rpx;
    padding-right: 20rpx;
    color: #666;
    z-index: 100;
    .tabs {
      background: #fff;
      z-index: 110;
      width: calc(~"100% - 100rpx");
      .tabs-view {
        align-items: center;
        display: flex;
        flex-wrap: nowrap;
        height: 80rpx;
        white-space: nowrap;
        view {
          flex: 1;
          display: inline-flex;
          margin-right: 20rpx;
          &.active{
            color: @base-color;
          }
        }
      }
    }
    .icon {
      display: flex;
      width: 80rpx;
      z-index: 200;
    }
  }
  @keyframes fadeinL {
    0% {
      opacity: 0;
      transform: translateX(-1rem);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  page {
    background: #eee;
    width: 100%;
    height: 100%;
  }
</style>
<template>
  <view class="newsLists">
    <view class="tag-tabs">
      <scroll-view scroll-x class="tabs">
        <view class="tabs-view">
          <block wx:for="{{tabs}}" wx:key="{{index}}">
            <view class="tab {{active == index ? 'active' : ''}}" @tap="tabHandle({{index}})">{{item.name}}</view>
          </block>
        </view>
      </scroll-view>
      <view class="icon">
        <view class="iconfont icon-home"></view>
      </view>
    </view>
    <list id="list" :params.sync="params"></list>
  </view>
</template>
<script>
  import list from "components/list"
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import DataMixin from "mixins/data";
  import db from "util/db"
  export default class NewsLists extends wepy.page {
    config = {
      navigationBarTitleText: "最新资讯",
      backgroundColor: "#eee"
    };
    components = {
      list: list,
    }
    mixins = [HttpMixin, ToastMixin, DataMixin];
    data = {
      active: 0,
      swipe: 0,
      swipeY: 0,
      params: {
        category: ""
      },
      tabs: [{
          name: "全部",
          category: "",
        },
        {
          name: "scuinfo",
          category: "scuinfo",
        },
        {
          name: "青春川大",
          category: "青春川大",
        },
        {
          name: "学工部",
          category: "学工部",
        },
        {
          name: "教务处",
          category: "教务处",
        },
        {
          name: "官网新闻",
          category: "四川大学新闻网",
        },
      ]
    };
    methods = {
      tabHandle(index) {
        this.active = index
      },
      moveStart(e) {
        this.swipe = e.touches[0].clientX
        this.swipeY = e.touches[0].clientY
      },
      moveEnd(e) {
        let changedX = e.changedTouches[0].clientX - this.swipe
        if (Math.abs(e.changedTouches[0].clientY - this.swipeY) >= Math.abs(changedX)) return;
        if (changedX > 60) {
          // 右移
          if (this.active < 5) this.active++
        } else if (changedX < -60) {
          // 左移
          if (this.active > 0) this.active--
        }
      }
    }
    
    watch = {
      active(newValue, oldValue) {
        this.params.category = this.tabs[newValue].category
        this.$invoke('list', 'getNewDetails', 1)
      }
    }
    onShareAppMessage(options) {
      return {
        title: "最新资讯"
      }
    }
  }
</script>

