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
      justify-content: flex-start;
      white-space: nowrap;
      view {
        display: inline-flex;
        margin-right: 20rpx;
        &.active {
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
      <view @tap="to" class="icon">
        <view class="iconfont icon-daohang"></view>
      </view>
    </view>
    <view @touchstart="moveStart" @touchend="moveEnd">
      <list id="list" :params.sync="params"></list>
    </view>
  </view>
</template>
<script>
import list from "components/list";
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import DataMixin from "mixins/data";
import MoveMixin from "mixins/move";
import db from "util/db";
export default class NewsLists extends wepy.page {
  config = {
    navigationBarTitleText: "最新资讯",
    backgroundColor: "#eee"
  };
  components = {
    list: list
  };

  mixins = [HttpMixin, ToastMixin, DataMixin, MoveMixin];
  data = {
    active: 0,
    params: {
      tag_name: ""
    }
  };
  computed = {
    tabs() {
      return [
        {
          name: "全部",
          type: ""
        }
      ].concat(db.Get("chooseTags"));
    }
  };
  methods = {
    tabHandle(index) {
      this.tabChange(index);
    },
    to() {
      wepy.navigateTo({
        url: "chooseTags"
      });
    }
  };
  tabChange(index) {
    if (index < 0 || index >= this.tabs.length) {
      return;
    }
    this.active = index;
    this.params.tag_name = this.tabs[index].name;
    this.$invoke("list", "getNewDetails", 1);
  }
  moveRight() {
    this.tabChange(this.active + 1);
  }
  moveLeft() {
    this.tabChange(this.active - 1);
  }
  onLoad() {
    if (!db.Get("chooseTags")) {
      db.Set("chooseTags", [
        {
          name: "青春川大",
          type: "org"
        },
        {
          name: "就业网",
          type: "org"
        },
        {
          name: "学工部",
          type: "org"
        },
        {
          name: "教务处",
          type: "org"
        }
      ]);
    }
  }
  onShareAppMessage(options) {
    return {
      title: "最新资讯"
    };
  }
}
</script>

