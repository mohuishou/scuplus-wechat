<style lang="less">
  @import "./src/less/config";
  @import "./src/icon/iconfont";
  page {
    background: @bg-color;
  }
  .lists {
    .list {
      padding: 10rpx 20rpx;
      display: flex;
      justify-content: space-between;
      &:nth-child(1) {
        border-top: 3rpx solid #eee;
      }
      border-bottom: 3rpx solid #eee;
      background: #fff;
      .name {
        font-size: 32rpx;
      }
    }
  }
  .user-info{
    margin-top: 100rpx;
    margin-bottom: 100rpx;
    text-align: center;
    image {
      @size: 150rpx;
      width: @size;
      height: @size;
      border-radius: @size / 2;
      border: 2rpx solid #eee;
      box-shadow: 4rpx 4rpx 4rpx #eee;
    }
    view{
      margin-top: 20rpx;
    }
  }
</style>

<template>
  <view class="my">
    <view class="user-info">
      <image src="{{avatar}}"></image>
      <view>{{nickName}}</view>
    </view>
    <view class="lists">
      <repeat for="{{items}}" item="item" key="index">
        <mview @mtap.user="to" :arg.sync="item">
          <view slot="content" class="list">
            <view class="name">{{item.name}}</view>
            <view class="iconfont icon-arrow-right"></view>
          </view>
        </mview>
      </repeat>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import MView from "components/mview";
  import HttpMixin from "mixins/http";
  import db from "util/db";
  export default class My extends wepy.page {
    config = {
      navigationBarTitleText: "个人中心"
    };
    components = {
      mview: MView
    };
    mixins = [HttpMixin];
    data = {
      items: [{
          name: "BUG反馈",
          url: "/pages/my/feedback?index=0"
        },
        {
          name: "功能建议",
          url: "/pages/my/feedback?index=1"
        },
        {
          name: "我的反馈",
          url: "/pages/my/feedbackList"
        },
        {
          name: "账号绑定",
          url: "/pages/bind"
        }
      ],
      nickName: "未授权",
      avatar: ""
    };
    getUserInfo() {
      const self = this
      wepy.getUserInfo({
        success: res => {
          self.nickName = res.userInfo.nickName;
          self.avatar = res.userInfo.avatarUrl;
          self.$apply()
          db.Set("nickName", self.nickName)
          db.Set("avatar", self.avatar)
        },
        fail: res => {
          wepy.showModal({
            title: "用户授权失败",
            content: "个人中心需要获取您的微信昵称和头像信息用于展示与反馈功能，点击确认授权，点击取消返回首页",
            success: r => {
              if (r.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (!res.authSetting["scope.userInfo"]) {
                      wepy.switchTab({
                        url: "/pages/index"
                      })
                    } else {
                      self.getUserInfo()
                    }
                  },
                  fail: res => {
                    console.log(res);
                    wepy.switchTab({
                      url: "/pages/index"
                    })
                  }
                })
              } else {
                wepy.switchTab({
                  url: "/pages/index"
                })
              }
            }
          })
        }
      });
    }
    methods = {
      to(item) {
        wepy.navigateTo({
          url: item.url
        });
      }
    };
    onLoad() {
      if (db.Get("nickName") != "") {
        this.nickName = db.Get("nickName")
        this.avatar = db.Get("avatar")
      } else {
        this.getUserInfo()
      }
    }
  }
</script>
