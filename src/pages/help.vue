<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 30rpx;
  padding-bottom: 100rpx;
}
.card {
  margin: 20rpx;
  overflow: hidden;
  padding: 20rpx;
  border-radius: 10rpx;
  box-shadow: 4rpx 4rpx 10rpx #eee;
  background: @white;
  .header {
    .active {
      color: @base-color;
    }
    .info {
      margin-top: 20rpx;
      display: flex;
      font-size: 26rpx;
      color: #888;
      > view {
        display: flex;
        align-items: baseline;
        margin-right: 30rpx;
        > view {
          margin-right: 10rpx;
        }
      }
    }
  }
  .content {
    overflow: hidden;
    height: 0;
    transition: all 0.3s ease-in-out;
    &.active {
      margin-top: 20rpx;
    }
  }
}
.mo-btn {
  position: fixed;
  bottom: 0;
}
</style>
<template>
  <view>
    <!-- <search title="请输入关键词"></search> -->
    <block wx:for="{{items}}" wx:key="index">
      <view @tap="active({{index}})" class="card">
        <view class="header">
          <view class="title">{{item.title}}</view>
          <view class="info">
            <view class="user">
              <view class="iconfont icon-user"></view>
              <view class="">管理员</view>
            </view>
            <view class="time">
              <view class="iconfont icon-time"></view>
              <view class="">{{item.created_at}}</view>
            </view>
          </view>
        </view>
      </view>
    </block>
    <button @tap="to" class="mo-btn">没有答案？我要反馈</button>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import Search from "components/search";
import dayis from "dayjs";
export default class Help extends wepy.page {
  config = {
    navigationBarTitleText: "帮助"
  };
  mixins = [HttpMixin, ToastMixin];
  components = {
    search: Search
  };
  data = {
    items: [
      {
        title: "账号无法绑定",
        created_at: "2018-06-06",
        content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
        active: false,
        height: 0
      }
    ]
  };
  methods = {
    active(i) {
      wepy.showModal({
        title: this.items[i].title, //提示的标题,
        content: this.items[i].content, //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: '已阅读', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#3CC51F', //确定按钮的文字颜色,
        success: res => {}
      });
    },
    to() {
      wepy.navigateTo({ url: "/pages/my/feedback" });
    }
  };

  async get() {
    try {
      const res = await this.GET("/helps");
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].created_at = dayis(res.data[i].created_at).format(
          "YYYY-MM-DD"
        );
        // res.data[i].active = false;
        // res.data[i].height = 0;
      }
      this.items = res.data;
      this.$apply();
    } catch (error) {
      console.error(error);
    }
  }

  onLoad() {
    this.get();
  }
}
</script>
