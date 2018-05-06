<style lang="less">
  @import "./src/less/bind";
  @base-color: #333;
  page {
    width: 100%;
    height: 100%;
  }
  .help {
    font-size: 0.7rem;
    color: #888;
    padding: 0 3%;
  }
  .input-group {
    &:hover {
      transition: all 1s;
      border: 1px solid #fefefe;
      .input-label {
        color: #fefefe;
        border-right: 1px solid #fefefe;
      }
    }
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    padding: 25rpx 10rpx;
    margin: 40rpx 3%;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    .input-label {
      color: #fefefe;
      font-size: 13pt;
      height: 25rpx;
      line-height: 25rpx;
      padding: 0 25rpx;
      border-right: 1px solid #d8d8d8;
    }
    input {
      color: #fefefe;
      flex: 1;
      font-size: 13pt;
      min-height: 52rpx;
      height: 52rpx;
      line-height: 52rpx;
      padding: 0 25rpx;
    }
    .input-placeholder,
    picker.placeholder {
      color: #ccc;
    }
  }
  #bind {
    width: 100%;
    height: 100%;
    #content {
      border-radius: 10rpx;
      margin: 100rpx auto;
      padding-top: 40rpx;
      background: rgba(255, 255, 255, 0.15);
      width: 95%;
      height: 700rpx;
      #title {
        font-size: 40rpx;
        text-align: center;
        color: #fefefe;
      }
      button {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        border-color: @base-color;
        margin: 20rpx; // width: calc(~"100% - 40rpx");
      }
      form {
        padding-top: 20rpx;
        display: block;
        width: 100%;
      }
    }
  }
</style>

<template>
  <view id="bind">
    <view id="stars"></view>
    <view id="stars2"></view>
    <view id="stars3"></view>
    <view id="content">
      <view id="title">
        绑定{{types[type].name}}
      </view>
      <form @submit="bind">
        <view class="input-group" hover-class="active">
          <text class="input-label">学号</text>
          <input name="student_id" type="number" placeholder="请输入您的学号/工号" />
        </view>
        <view class="input-group" hover-class="active">
          <text class="input-label">密码</text>
          <input name="password" type="password" placeholder="请输入您的密码" />
        </view>
        <view class="help">
          <view>{{types[type].help}}</view>
        </view>
        <button formType="submit">绑定</button>
      </form>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db";
  export default class BindJwc extends wepy.page {
    config = {
      navigationBarTitleText: "",
      navigationBarBackgroundColor: '#090a0f',
      navigationBarTextStyle: 'white',
    };
    mixins = [HttpMixin, ToastMixin];
    components = {};
    data = {
      type: "bind",
      types: {
        "bind": {
          "name": "统一认证账号",
          "url": "/bind",
          "verify": "verify",
          "help": "密码为统一身份认证平台(即EDU邮箱)的密码，默认密码为身份证后六位,忘记密码可以访问 my.scu.edu.cn 找回"
        },
        "library": {
          "name": "图书馆",
          "url": "/library/bind",
          "verify": "library_verify",
          "help": "密码为图书馆的密码，默认密码为身份证后六位,忘记密码可以访问图书馆找回"
        },
        "jwc": {
          "name": "教务处",
          "url": "/jwc/bind",
          "verify": "jwc_verify",
          "help": "密码为教务处的密码，默认密码为身份证后六位,忘记密码可以访问教务处找回"
        },
      }
    }
    methods = {
      bind(e) {
        let params = e.detail.value;
        if (params.student_id == 0 || params.password == "") {
          this.ShowToast("学号密码必填！");
          return;
        }
        this.Bind(params);
      }
    }
    onLoad(option) {
      this.type = option.type || this.type
    }
    async Bind(params) {
      try {
        const res = await this.POST(this.types[this.type].url || "/bind", params);
        db.Set(this.types[this.type].verify || "verify", 1);
        wepy.showModal({
          title: "绑定成功",
          content: "点击确认掉转到首页，请在首页点击查看we川大使用说明！",
          showCancel: false,
          success: function(res) {
            // 关闭所有页面并且跳转到首页，确保verify数据重新获取
            wepy.reLaunch({
              url: "/pages/index"
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
</script>
