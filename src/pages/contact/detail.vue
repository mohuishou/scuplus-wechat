<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 30rpx;
}

.panel {
  margin: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 4rpx 4rpx 10rpx #eee;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.contact {
  font-size: 28rpx;
  > view {
    display: flex;
    margin: 10rpx auto;
    .name {
      color: #666;
      min-width: 150rpx;
    }
  }
}
.info {
  margin: 20rpx;
  color: #888;
  font-size: 26rpx;
}
</style>
<template>
  <view>
    <view @tap="copy()" class="header panel">
      <view class="title">{{category.name}}</view>
      <view class="iconfont icon-link"></view>
    </view>
    <view class="contacts">
      <view wx:for="{{items}}" @tap="call({{index}})" wx:key="index" class="contact panel">
        <view>
          <view class="name">部门</view>
          <view>{{item.title}}</view>
        </view>
        <view>
          <view class="name">联系方式</view>
          <view>{{item.contact}}</view>
        </view>
        <view wx:if="{{item.comment}}">
          <view class="name">备注</view>
          <view>{{item.comment}}</view>
        </view>
      </view>
    </view>
    <view class="info">
      所有的联系方式，都来自官网，We川大不能保证联系方式一定正确，点击最上面的可以复制联系方式指向的链接
    </view>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
export default class ContactDetail extends wepy.page {
  config = {};
  mixins = [HttpMixin, ToastMixin];
  data = {
    category: {},
    items: {}
  };
  methods = {
    copy() {
      const url = this.category.url;
      const self = this;
      wepy.setClipboardData({
        data: url,
        success: res => {
          console.log(res);
        },
        fail: res => {
          console.error(res);
          self.ShowToast("复制失败:" + res);
        }
      });
    },
    call(i) {
      const item = this.items[i];
      wepy.showModal({
        title: "提示", //提示的标题,
        content: "是否拨打" + item.title + "电话", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        success: res => {
          if (res.confirm) {
            wepy.makePhoneCall({ phoneNumber: item.contact });
          }
        }
      });
    }
  };

  async get() {
    try {
      const res = await this.GET("/contact/item/" + this.category.id);
      this.items = res.data;
      this.$apply();
    } catch (error) {
      console.error(error);
    }
  }

  onLoad(option) {
    if (!("category" in option)) {
      this.ShowToast("参数错误！");
      return;
    }
    const category = JSON.parse(option.category);
    this.category = category;
    wepy.setNavigationBarTitle({ title: category.name + "通讯录" });
    this.get();
  }
}
</script>
