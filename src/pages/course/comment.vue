<style lang="less">
  @import "./src/less/config";
  page {
    // background: @bg-color;
    font-size: 28rpx;
  }
  radio-group {
    margin: 20rpx;
    margin-bottom: 30rpx;
    display: flex;
    align-items: baseline;
    .title {
      margin-right: 20rpx;
    }
    .radios {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      >label {
        margin-right: 20rpx;
        border-radius: 6rpx;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4rpx 12rpx;
        margin: 0rpx 20rpx 10rpx 0rpx;
        font-size: 28rpx;
        color: @base-color;
        border: 2rpx solid @base-color;
        &.checked {
          background: @base-color;
          color: #fff;
        }
      }
    }
  }
  /*  重写 radio 样式  */
  radio .wx-radio-input {
    display: none;
  }
  textarea {
    width: calc(~"100% - 85rpx");
    margin: 20rpx;
    border: 2rpx solid @base-color;
    padding: 20rpx;
    border-radius: 6rpx;
    height: 200rpx;
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
  .header {
    color: #000;
    font-size: 30rpx;
    margin: 20rpx;
    margin-bottom: 30rpx;
    text-align: center;
  }
</style>

<template>
  <view>
    <view class="header">
      {{params.course_name}}
    </view>
    <form @submit="submit">
      <block wx:for="{{items}}" wx:key="{{index}}">
        <radio-group name="{{item.name}}" class="radio-group">
          <view class="title">
            {{item.title}}
          </view>
          <view class="radios">
            <block wx:for="{{item.radios}}" wx:key="i" wx:for-index="i" wx:for-item="data">
              <label @tap="checked({{index}},{{i}})" class="{{data.checked ? 'checked' : ''}}"><radio value="{{data.value}}" checked="{{data.checked}}" />{{data.name}}</label>
            </block>
          </view>
        </radio-group>
      </block>
      <textarea name="comment" value="{{comment}}" placeholder="请输入课程评价"></textarea>
      <button form-type="submit">提交课程评价</button>
    </form>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db";
  import DataMixin from "mixins/data";
  import TermMixin from "mixins/term";
  export default class CourseLists extends wepy.page {
    config = {
      navigationBarTitleText: "课程评价"
    };
    mixins = [HttpMixin, ToastMixin];
    data = {
      params: {},
      comment: "",
      items: [{
          name: "call_name",
          title: "点名",
          radios: [{
              name: "全点",
              value: 4,
              checked: false
            },
            {
              name: "抽点",
              value: 3,
              checked: false
            },
            {
              name: "偶尔点名",
              value: 2,
              checked: false
            },
            {
              name: "不点名",
              value: 1,
              checked: false
            }
          ]
        },
        {
          name: "exam_type",
          title: "考核",
          radios: [{
              name: "论文",
              value: 1,
              checked: false
            },
            {
              name: "考试",
              value: 2,
              checked: false
            },
            {
              name: "大作业",
              value: 3,
              checked: false
            },
            {
              name: "其他",
              value: 4,
              checked: false
            }
          ]
        },
        {
          name: "task",
          title: "作业",
          radios: [{
              name: "有作业",
              value: 1,
              checked: false
            },
            {
              name: "没作业",
              value: 2,
              checked: false
            }
          ]
        },
        {
          name: "star",
          title: "评价",
          radios: [{
              name: "很好",
              value: 3,
              checked: false
            },
            {
              name: "一般",
              value: 2,
              checked: false
            },
            {
              name: "糟糕",
              value: 1,
              checked: false
            }
          ]
        }
      ]
    };
    methods = {
      checked(i, j) {
        for (let m = 0; m < this.items[i].radios.length; m++) {
          if (m != j) this.items[i].radios[m].checked = false;
        }
        this.items[i].radios[j].checked = !this.items[i].radios[j].checked;
      },
      submit(e) {
        let params = Object.assign(this.params, e.detail.value);
        const self = this;
        wx.getUserInfo({
          success: async function(res) {
            params.nick_name = res.userInfo.nickName;
            params.avatar = res.userInfo.avatarUrl;
            for (const x in params) {
              if (!params[x]) {
                self.ShowToast("所有项目均为必填！")
                return
              }
            }
            try {
              let url = 　"/course/comment"
              if (params.id > 0) {
                url += "/update"
              }
              const resp = await self.PostWithBind(url, params);
              self.ShowToast("评价成功！");
              setTimeout(() => {
                wepy.navigateBack({
                  delta: "1"
                });
              }, 1000);
            } catch (error) {}
          },
          fail: function() {
            wepy.showModal({
              title: "权限", //提示的标题
              content: "需要获取您的微信昵称和头像权限", //提示的内容
              showCancel: false, //是否显示取消按钮
              success: res => {
                wepy.openSetting({
                  success: res => {}
                });
              }
            });
          }
        });
      }
    };
    async onLoad(option) {
      this.params = option;
      // 有id表示需要修改
      if ("id" in option && option.id > 0) {
        const resp = await this.GetWithBind("/course/comment?id=" + option.id);
        console.log(resp);
        for (let i = 0; i < this.items.length; i++) {
          const v = resp.data[this.items[i].name];
          for (let j = 0; j < this.items[i].radios.length; j++) {
            this.items[i].radios[j].checked = false;
            if (v == this.items[i].radios[j].value)
              this.items[i].radios[j].checked = true;
          }
        }
        this.comment = resp.data.comment;
        this.$apply();
      }
    }
  }
</script>