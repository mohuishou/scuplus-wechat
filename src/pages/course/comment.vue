<style lang="less">
  @import "./src/less/config";
  page {
    // background: @bg-color;
    font-size: 28rpx;
  }
  radio-group {
    margin: 20rpx;
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
    background: #fff;
    color: @base-color;
    margin: 20rpx;
    border: 2rpx solid @base-color;
    font-size: 28rpx;
    &:hover {
      background: @base-color;
      color: #fff;
    }
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
      大学英语
    </view>
    <form @submit="comment">
      <block wx:for="{{items}}" wx:key="{{index}}">
        <radio-group class="radio-group">
          <view class="title">
            {{item[0]}}
          </view>
          <view class="radios">
            <block wx:for="{{item[1]}}" wx:key="i" wx:for-index="i" wx:for-item="data">
              <label @tap="checked({{index}},{{i}})" class="{{data.checked ? 'checked' : ''}}"><radio value="{{data.value}}" checked="{{data.checked}}" />{{data.name}}</label>
            </block>
          </view>
        </radio-group>
      </block>
      <textarea placeholder="请输入课程评价"></textarea>
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
    config = {};
    data = {
      items: [
        [
          "点名", [{
              name: "点名",
              value: 0,
              checked: false
            },
            {
              name: "偶尔全点",
              value: 0,
              checked: false
            },
            {
              name: "偶尔抽点",
              value: 0,
              checked: false
            },
            {
              name: "不点名",
              value: 0,
              checked: false
            }
          ]
        ]
      ]
    };
    methods = {
      checked(i, j) {
        for (let m = 0; m < this.items[i][1].length; m++) {
          this.items[i][1][m].checked = false
        }
        this.items[i][1][j].checked = true
      }
    };
    onLoad() {}
  }
</script>