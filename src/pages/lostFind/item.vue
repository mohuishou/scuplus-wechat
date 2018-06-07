<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 28rpx;
  padding-bottom: 80rpx;
}
.screenshots {
  width: 100%;
  height: 422rpx;
  .slide-image {
    background: #fff;
    width: 100%;
    height: 422rpx;
    background-size: cover;
    background-position: center;
  }
}
.header {
  &.group {
    border-top: none;
  }
  .name {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
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
.group {
  background: #fff;
  padding: 20rpx;
  margin-bottom: 15rpx;
  border-bottom: 2rpx solid #eee;
  border-top: 2rpx solid #eee;
  &.screenshot {
    margin-bottom: 0;
    border-bottom: none;
    .title {
      margin-bottom: 0;
    }
  }
  .title {
    margin-bottom: 30rpx;
    border-left: 10rpx solid @base-color;
    padding-left: 20rpx;
  }
}
button.mo-btn {
  position: fixed;
  bottom: 0;
}
</style>
<template>
  <view>
    <view class="header group">
      <view class="name">
        {{item.title}}
      </view>
      <view class="info">
        <view class="user">
          <view class="iconfont icon-user"></view>
          <view>{{item.nickname || '某同学'}}</view>
        </view>
        <view class="time">
          <view class="iconfont icon-time"></view>
          <view>{{item.created_at}}</view>
        </view>
      </view>
    </view>
    <view class="group">
      <view class="title">
        描述
      </view>
      <view class="content">
        {{item.info}}
      </view>
    </view>
    <view class="group">
      <view class="title">
        地点
      </view>
      <view class="content">
        {{item.address}}
      </view>
    </view>
    <view class="group">
      <view class="title">
        联系方式
      </view>
      <view class="content">
        {{item.nickname}}（{{item.contact}}）
      </view>
    </view>
    <view class="group" wx:if="{{item.category == '一卡通招领'}}">
      <view class="title">
        一卡通信息
      </view>
      <view class="content">
        <view>学院: {{item.card_info.college}}</view>
        <view>姓名: {{item.card_info.name}}</view>
        <view>学号: {{item.card_info.no}}</view>
      </view>
    </view>
    <block wx:else>
      <view class="group screenshot">
        <view class="title">
          截图
        </view>
      </view>
      <swiper class="screenshots">
        <block wx:for="{{images}}" wx:key="index">
          <swiper-item>
            <view @tap="showImg({{item}})" style="background-image: url({{item}})" class="slide-image"></view>
          </swiper-item>
        </block>
      </swiper>
    </block>
    <button wx:if="{{is_me}}" @tap="to()" class="mo-btn">修改信息</button>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import db from "util/db";
import dayjs from "dayjs";
export default class BindJwc extends wepy.page {
  config = {
    enablePullDownRefresh: true,
  };
  mixins = [HttpMixin, ToastMixin];
  data = {
    images: [
      "http://img.zcool.cn/community/01b37659aece1aa801211d251b0fef.png@1280w_1l_2o_100sh.webp"
    ],
    height: 500,
    item: {},
    is_me: false,
    id: 1
  };

  methods = {
    to() {
      wepy.navigateTo({
        url: "/pages/lostFind/new?item=" + JSON.stringify(this.item)
      });
    },
    showImg(url) {
      wepy.previewImage({
        urls: this.images, //需要预览的图片链接列表,
        current: url
      });
    }
  };

  /**
   * 隐藏学号
   */
  hiddenSid(sid) {
    let arr = sid.split("");
    arr.splice(-6, 4, "****");
    return arr.join("");
  }

  async get() {
    try {
      const res = await this.GetWithBind("/lost_find/" + this.id);
      let data = res.data.data;
      data.created_at = dayjs(data.created_at).format("YYYY-MM-DD");
      if (data.category == "一卡通招领") {
        data.card_info = JSON.parse(data.card_info);
        if (!res.data.is_me && !res.data.is_owner)
          data.card_info.no = this.hiddenSid(data.card_info.no);
      } else {
        this.images = data.pictures.split(",");
      }
      this.is_me = res.data.is_me;
      this.item = data;
      this.$apply();
    } catch (error) {
      console.error(error);
    }
  }

  async onPullDownRefresh() {
    await this.get();
    wepy.stopPullDownRefresh();
  }

  onLoad(option) {
    if (!("id" in option)) {
      this.ShowToast("参数错误！");
      return;
    }
    this.id = option.id;
    this.get();
  }
}
</script>
