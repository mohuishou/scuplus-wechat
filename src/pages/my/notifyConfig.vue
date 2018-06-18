<style lang="less">
page {
  font-size: 30rpx;
}
.group {
  display: flex;
  padding: 20rpx;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2rpx solid #ddd;
}
</style>
<template>
  <view>
    <block wx:for="{{items}}" wx:key="index">
      <view class="group">
        <view class="title">
          {{item.title}}
        </view>
        <switch checked="{{(item.value & notify) == item.value}}" @change="change({{item.value}})" />
      </view>
    </block>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
export default class My extends wepy.page {
  config = {
    navigationBarTitleText: "通知设置"
  };
  mixins = [HttpMixin, ToastMixin];
  data = {
    notify: (1 << 10) - 1,
    items: [
      {
        title: "成绩通知",
        value: 1 << 0
      },
      {
        title: "图书通知",
        value: 1 << 1
      },
      {
        title: "考试通知",
        value: 1 << 2
      }
    ]
  };
  methods = {
    change(v, e) {
      this.notify ^= v;
      this.update()
    }
  };

  async get() {
    try {
      const res = await this.GET("/user/config/notify");
      this.notify = res.data;
      this.$apply();
    } catch (error) {
      console.error(error);
    }
  }

  async update() {
    try {
      const res = await this.POST("/user/config/notify", {
        notify: this.notify
      });
    } catch (error) {
      console.error(error);
    }
  }

  onLoad() {
    this.get();
  }
}
</script>
