<!--suppress CssInvalidPropertyValue -->
<style lang="less">
  @import url("../less/config");
  page {
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
      border: 2px solid @base-color;
    }
    display: flex;
    align-items: center;
    padding: 25rpx 10rpx;
    margin: 40rpx 3%;
    background: #fff;
    border-radius: 5px;
    border: 2px solid #f4f4f4;
    .input-label {
      color: #888;
      font-size: 13pt;
      height: 25rpx;
      line-height: 25rpx;
      padding: 0 25rpx;
      border-right: 1px solid #d8d8d8;
    }
    input {
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
    height: 100%;
    #title {
      width: 100%;
      display: flex;
      justify-content: center;
      height: 30%;
      flex-wrap: wrap;
      background: @base-color;
      color: #fff;
      font-size: 2rem;
      text-align: center;
      view {
        margin-top: calc(~"15% - 1rem");
      }
      text {
        display: block;
        width: 100%;
      }
    }
    button {
      background: @base-color;
      color: #fff;
      border-color: @base-color;
      margin: auto 20rpx;
      position: absolute;
      bottom: 2rem;
      width: calc(~"100% - 40rpx");
    }
    form {
      padding-top: 1rem;
      display: block;
      width: 100%;
      height: calc(~"60% - 1rem");
      background: #fefefe;
    }
  }
</style>

<template>
  <view id="bind">
    <view id="title">
      <view>
        <text>We川大</text>
      </view>
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
        <view>密码为统一身份认证平台(即EDU邮箱)的密码，默认密码为身份证后六位</view>
        <view>忘记密码可以访问 my.scu.edu.cn 找回</view>
      </view>
      <button formType="submit">绑定</button>
    </form>
  </view>
</template>

<script>
  import wepy from 'wepy'
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db"
  export default class BindJwc extends wepy.page {
    config = {
      navigationBarTitleText: ''
    };
    mixins = [HttpMixin, ToastMixin]
    components = {}
    methods = {
      bind(e) {
        let params = e.detail.value
        if (params.student_id == 0 || params.password == '') {
          this.ShowToast('学号密码必填！')
          return
        }
        this.Bind(params)
      }
    };
    async Bind(params) {
      try {
        const res = await this.POST('/bind', params)
        db.Set('verify', 1)
        wepy.showModal({
          title: "绑定成功",
          content: "点击确认掉转到首页，请在首页点击查看we川大使用说明！",
          showCancel: false,
          success: function(res) {
            // 关闭所有页面并且跳转到首页，确保verify数据重新获取
            wepy.reLaunch({
              url: "/pages/index"
            })
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
  }
</script>
