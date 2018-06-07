<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 28rpx;
}
scroll-view {
  padding-top: 30px;
}
.list {
  // margin-bottom: 20rpx;
  padding: 20rpx;
  width: calc(~"100% - 40rpx");
  background: #fff;
  border-bottom: 2rpx solid #eee;
  display: flex;
  height: 180rpx;
  .preview {
    width: 240rpx;
    height: 180rpx;
    background-position: center;
    background-size: cover;
  }
  > view {
    width: calc(~"100% - 200rpx");
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    > view {
      width: 100%;
    }
    .info {
      display: flex;
      font-size: 24rpx;
      color: #888;
      > view {
        margin-right: 15rpx;
        display: flex;
        .iconfont {
          margin-right: 5rpx;
        }
      }
    }
  }
}
.tabs {
  position: fixed;
  width: calc(~"100% - 50rpx");
  display: flex;
  background: #fff;
  font-size: 28rpx;
  padding: 0 20rpx;
  height: 30px;
  z-index: 100;
  .tab {
    text-align: center;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      color: @base-color;
    }
    .iconfont {
      margin-left: 5rpx;
      transition: all 0.5s ease;
      &.asc {
        transition: all 0.5s ease;
        transform: rotateX(180deg);
      }
    }
    text {
      color: #888;
      font-size: 24rpx;
    }
  }
}
</style>
<template>
  <view>
    <view class="tabs">
      <block wx:for="{{categories}}" wx:key="index">
        <view @tap="changeCid({{index}})" class="tab {{cid === index ? 'active' : ''}}">
          {{item}}
        </view>
      </block>
    </view>
    <scroll-view>
      <block wx:for="{{items}}" wx:key="index">
        <view class="list" @tap="to({{item.id}})">
          <view>
            <view class="title">
              {{item.title}}
            </view>
            <view class="info">
              <view class="name">
                <view class="iconfont icon-user"></view>
                <view>{{item.nickname || "某同学"}}</view>
              </view>
              <view class="time">
                <view class="iconfont icon-time"></view>
                <view>{{item.created_at}}</view>
              </view>
            </view>
          </view>
          <view class="preview" style="background-image: url({{item.pictures}})"></view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import db from "util/db";
import dayjs from "dayjs";
export default class BindJwc extends wepy.page {
  config = {};
  data = {
    categories: ["报失", "一卡通招领", "其他招领"],
    cid: 0,
    items: [1, 2, 3, 4, 5, 6],
    lastPage: false,
    param: {
      page: 1,
      page_size: 15,
      category: "报失"
    }
  };
  mixins = [HttpMixin, ToastMixin];
  methods = {
    changeCid(cid) {
      this.cid = cid;
      this.param.category = this.categories[this.cid];
      this.getLists();
    },
    to(id) {
      wepy.navigateTo({ url: "/pages/lostFind/item?id=" + id });
    }
  };

  // 获取列表
  async getLists() {
    try {
      if (this.param.page > 1 && this.lastPage) return;
      if (this.param.page === 1) this.lastPage = false;
      const res = await this.GetWithBind("/lost_finds", this.param);
      if (res.data && res.data.length === 0) {
        this.ShowToast("没有数据了！");
        this.lastPage == true;
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].created_at = dayjs(res.data[i].created_at).format(
          "YYYY-MM-DD"
        );
        if (!res.data[i].pictures) {
          res.data[i].pictures =
            "http://scuplus-1251451068.coscd.myqcloud.com/nopic.jpg";
        }
      }
      this.items = res.data;
      this.$apply();
    } catch (error) {
      console.error(error);
    }
  }

  onLoad(option) {
    // 显示分类
    if ("cid" in option) {
      this.cid = option.cid;
      this.param.category = this.categories[this.cid];
    }
    this.getLists();
  }
}
</script>
