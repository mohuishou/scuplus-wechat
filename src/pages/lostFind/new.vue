<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 28rpx;
}
.group {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
  label {
    display: flex;
    align-items: baseline;
    border-bottom: 2rpx solid #eee;
    &.desc {
      align-items: flex-start;
      .title {
        padding-top: 10rpx;
      }
    }
    &.image {
      align-items: center;
    }
    .title {
      width: 120rpx;
    }
    input,
    textarea,
    picker {
      width: calc(~"100% - 160rpx");
      padding: 20rpx 20rpx;
    }
    picker {
      padding: 25rpx 20rpx;
    }
  }
  textarea {
    height: 200rpx;
  }
}
button {
  position: fixed;
  bottom: 0;
  border-radius: 0;
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, @base-color, #ed5a65);
  color: #fff;
  font-size: 28rpx;
}
.image-up {
  width: 150rpx;
  height: 150rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
  background-size: cover;
  .iconfont {
    font-size: 120rpx;
    color: #888;
  }
}
</style>

<template>
  <view>
    <form @submit="submit">
      <view class="group">
        <label>
          <view class="title">标题</view>
          <input name="title" placeholder="请输入标题" />
        </label>
        <label>
          <view class="title">地点</view>
          <input name="address" placeholder="请输入地点" />
        </label>
        <label>
          <view class="title">类型</view>
          <picker name="category" @change="changeCategories" value="{{cid}}" range="{{categories}}">
            <view class="picker">
              {{categories[cid]}}
            </view>
          </picker>
        </label>
        <label class="desc">
          <view class="title">描述</view>
          <textarea name="info" placeholder="请输入物品描述"></textarea>
        </label>
        <label class="image">
          <view class="title">图片上传</view>
          <input name="pictures" type="text" style="display: none;" value="{{imageUrl}}" />
          <view style="background-image: url({{imageUrl}});" @tap="chooseImg" class="image-up">
            <view wx:if="{{imageUrl == ''}}" class="iconfont icon-add"></view>
          </view>
        </label>
      </view>
      <view class="group">
        <label>
          <view class="title">称呼</view>
          <input name="user_name" placeholder="建议不要输入全名" />
        </label>
        <label>
          <view class="title">联系方式</view>
          <picker name="contact_type" @change="changeCallType" value="{{tid}}" range="{{callTypes}}">
            <view class="picker">
              {{callTypes[tid]}}
            </view>
          </picker>
        </label>
        <label>
          <view class="title">联系</view>
          <input name="contact" placeholder="{{tid == 4 ? '不建议使用手机号' : '请输入' + callTypes[tid]}}" />
        </label>
      </view>
      <button form-type="submit">提交课程评价</button>
    </form>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import db from "util/db";
import { Upload, ImageCheck } from "util/cos";
export default class BindJwc extends wepy.page {
  config = {};
  mixins = [HttpMixin, ToastMixin];
  data = {
    categories: ["报失", "一卡通招领", "其他招领"],
    cid: 0,
    callTypes: ["QQ", "微信", "微博", "邮箱", "手机"],
    tid: 0,
    imageUrl: ""
  };
  methods = {
    changeCategories(e) {
      this.cid = e.detail.value || 0;
    },
    changeCallType(e) {
      this.tid = e.detail.value || 0;
    },
    chooseImg() {
      const self = this;
      wepy.chooseImage({
        count: 1, //最多可以选择的图片张数,
        sizeType: ["compressed"],
        success: res => {
          let paths = res.tempFilePaths;
          if (!paths || paths.length == 0) {
            self.ShowToast("没有选取图片！");
            return;
          }
          self.imageUrl = paths[0];
          self.$apply();
        }, //返回图片的本地文件路径列表 tempFilePaths,
        fail: () => {
          self.ShowToast("图片选取失败！");
        },
        complete: () => {}
      });
    },
    async submit(e) {
      let params = e.detail.value;

      // 参数校验
      for (const key in params) {
        if ((key != "image" && params[key] === "") || this.imageUrl === "") {
          this.ShowToast("不能有空值！");
          return;
        }
      }

      // 图片检查
      try {
        wx.showLoading({
          title: "图片检查中...",
          mask: true
        });
        const check_res = await ImageCheck(this.imageUrl);
      } catch (error) {
        this.ShowToast(error);
        return;
      }

      // 图片上传
      try {
        wx.hideLoading();
        wx.showLoading({
          title: "图片上传中...",
          mask: true
        });
        const res = await Upload(this.imageUrl, "lost_find");
        params.pictures = res.Location || "";
      } catch (error) {
        this.ShowToast("图片上传失败！");
        return;
      }
      wx.hideLoading();

      // 参数转换
      params.contact = `[${this.callTypes[params.contact_type]}]: ${
        params.contact
      }`;
      delete params.contact_type;
      params.category = this.categories[params.category];

      // 上传到服务器
      try {
        await this.PostWithBind("/lost_find", params);
      } catch (error) {
        console.log(error);
      }
    }
  };
}
</script>
