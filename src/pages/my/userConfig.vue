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
    <view class="group">
      <view class="title">
        本科生
      </view>
      <switch checked="{{user_type === 0}}" @change="changeUserType" />
    </view>
    <view class="group">
      <view class="title">
        研究生
      </view>
      <switch checked="{{user_type === 1}}" @change="changeUserType" />
    </view>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import db from "util/db";
export default class UserConfig extends wepy.page {
  config = {
    navigationBarTitleText: "用户设置"
  };
  mixins = [HttpMixin, ToastMixin];
  data = {
    user_type: 0
  };
  methods = {
    changeUserType() {
      this.user_type = (this.user_type + 1) % 2;
      this.updateUserType();
    }
  };
  async updateUserType() {
    try {
      await this.POST("/user/config/type", {
        user_type: this.user_type
      });
      // 更新成功，更新缓存
      db.Set("user_type", this.user_type);
    } catch (error) {
      // 更新失败恢复设置
      console.error(error);
      this.user_type = (this.user_type + 1) % 2;
      this.$apply();
    }
  }
  onLoad() {
    this.user_type = db.Get("user_type") || 0;
  }
}
</script>
