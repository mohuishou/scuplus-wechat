<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
  }
  .lists {
    .list-group{
      margin-bottom: 20rpx;
    }
    .list {
      padding: 10rpx 20rpx;
      display: flex;
      justify-content: space-between;
      border-bottom: 2rpx solid #efefef;
      background: #fff;
      .name {
        font-size: 32rpx;
      }
    }
  }
  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 80rpx 0;
    flex-wrap: wrap;
    .avatar {
      @size: 150rpx;
      width: @size;
      height: @size;
      border-radius: 50%;
      border: 2rpx solid #eee;
      overflow: hidden;
      box-shadow: 4rpx 4rpx 4rpx #eee;
    }
    .name {
      text-align: center;
      margin-top: 20rpx;
      width: 100%;
    }
  }
</style>

<template>
  <view class="my">
    <view class="user-info">
      <view class="avatar">
        <open-data type="userAvatarUrl"></open-data>
      </view>
      <view class="name">
        <open-data type="userNickName" lang="zh_CN"></open-data>
      </view>
    </view>
    <view class="lists">
      <view class="list-group">
        <repeat for="{{feedbacks}}" item="item" key="index">
          <mview @mtap.user="to" :arg.sync="item">
            <view slot="content" class="list">
              <view class="name">{{item.name}}</view>
              <view class="iconfont icon-arrow-right"></view>
            </view>
          </mview>
        </repeat>
      </view>
      <view class="list-group">
        <repeat for="{{binds}}" item="item" key="index">
          <mview2 @mtap.user="to" :arg.sync="item">
            <view slot="content" class="list">
              <view class="name">{{item.name}}</view>
              <view class="iconfont icon-arrow-right"></view>
            </view>
          </mview2>
        </repeat>
      </view>
      <mview3 class="warn" @mtap.user="to" :arg.sync="qqGroup">
        <view slot="content" class="list">
          <view class="name">QQ群</view>
          <view class="iconfont icon-arrow-right"></view>
        </view>
      </mview3>
      <mview4 class="warn" @mtap.user="clear">
        <view slot="content" class="list">
          <view class="name">清空缓存</view>
          <view class="iconfont icon-arrow-right"></view>
        </view>
      </mview4>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import MView from "components/mview";
  import HttpMixin from "mixins/http";
  import db from "util/db";
  import ToastMixin from "mixins/toast";
  export default class My extends wepy.page {
    config = {
      navigationBarTitleText: "个人中心"
    };
    components = {
      mview: MView,
      mview2: MView,
      mview3: MView,
      mview4: MView,
    };
    mixins = [HttpMixin, ToastMixin];
    data = {
      feedbacks: [{
          name: "BUG反馈",
          url: "/pages/my/feedback?index=0",
          type: "page"
        },
        {
          name: "功能建议",
          url: "/pages/my/feedback?index=1",
          type: "page"
        },
        {
          name: "我的反馈",
          url: "/pages/my/feedbackList",
          type: "page"
        },
      ],
      binds: [{
          name: "教务处绑定",
          url: "/pages/bind?type=jwc",
          type: "page"
        },
        {
          name: "统一认证中心绑定",
          url: "/pages/bind",
          type: "page"
        },
        {
          name: "图书馆绑定",
          url: "/pages/bind?type=library",
          type: "page"
        },
      ],
      qqGroup: {
        url: "698433701",
        type: "copy"
      }
    };
    methods = {
      to(item) {
        if (item.type == "copy") {
          const self = this
          wepy.setClipboardData({
            data: item.url,
            success: function(res) {
            },
            fail: res => {
              self.ShowToast("复制失败！")
            }
          })
        } else {
          wepy.navigateTo({
            url: item.url
          });
        }
      },
      clear() {
        const self = this
        wepy.showModal({
          title: "确认清空缓存",
          content: "会删除所有本地数据，需要退出小程序后重新进入！",
          success: function(res) {
            if (res.confirm) {
              try {
                // 保留token 和 verify
                const token = db.Get("token")
                const verify = db.Get("verify")
                wx.clearStorageSync()
                db.Set("token", token)
                db.Set("verify", verify)
                // 关闭所有页面并且跳转到首页，确保verify数据重新获取
                wepy.reLaunch({
                  url: "/pages/index"
                });
              } catch (e) {
                self.ShowToast("清空失败！")
              }
            }
          }
        })
      }
    };
    onLoad() {
    }
  }
</script>
