<template>
  <view class="newsLists" @touchstart="moveStart" @touchend="moveEnd">
    <view class="tab-lists">
      <view class="tabs">
        <block wx:for="{{tabs}}" wx:key="{{index}}">
          <view class="tab {{active == index ? 'active' : ''}}" @tap="tabHandle({{index}})">{{item.name}}</view>
        </block>
      </view>
      <view class="slider" style="transform: translateX({{100 * active}}%);">
        <view class="indicator"></view>
      </view>
    </view>
    <list id="list" :params.sync="params"></list>
  </view>
</template>
<script>
  import list from "../components/list"
  import wepy from "wepy";
  export default class NewsLists extends wepy.page {
    config = {
      navigationBarTitleText: "最新资讯",
      backgroundColor: "#eee"
    };
    components = {
      list: list,
    }
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
<style lang="less">
  @base-color: #f06292;
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
  .newsLists {
    height: 100%;
  }
  .slider {
    position: relative;
    width: 100%/6;
    -webkit-transition: all 0.2s cubic-bezier(0.38, 0.8, 0.32, 1.07);
    transition: all 0.2s cubic-bezier(0.38, 0.8, 0.32, 1.07);
  }
  .slider .indicator {
    position: relative;
    width: 50px;
    max-width: 100%;
    margin: 0 auto;
    height: 2px;
    background: @base-color;
    border-radius: 1px;
  }
  .tab-lists {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 9999;
  }
  .tabs {
    background: #fff;
    display: flex;
    justify-content: space-around;
    overflow: auto;
    padding: 0.3rem 0.2rem;
    font-size: 0.8rem;
    .tab {
      flex: 1;
      color: #666;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        color: @base-color;
      }
    }
  }
</style>
