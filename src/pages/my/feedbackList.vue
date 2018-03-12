<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
  }
  .lists {
    .list {
      border: 2rpx solid #eee;
      box-shadow: 4rpx 4rpx 10rpx #eee;
      margin: 20rpx;
      padding: 20rpx;
      background: @white;
    }
    .tags {
      display: flex;
      align-items: flex-end;
      .tag {
        border-radius: 6rpx;
        display: flex;
        padding: 5rpx 8rpx;
        margin: 20rpx 10rpx 0 0rpx;
        font-size: 20rpx;
        color: #888;
        border: 2rpx solid #888;
        &.open {
          color: #008e59;
          border: 2rpx solid #008e59;
        }
        &.close {
          color: @base-color;
          border: 2rpx solid @base-color;
        }
      }
    }
  }
</style>

<template>
  <view>
    <view wx:if="{{feedbacks.length > 0}}" class="lists">
      <block wx:for="{{feedbacks}}" wx:key="{{index}}">
        <view class="list" @tap="to({{item.number}})">
          <view class="title">{{item.title}}</view>
          <view class="tags">
            <blcok wx:for="{{item.tagArr}}" wx:for-item="tag" wx:for-index="i" wx:key="{{i}}">
              <view class="tag {{tag == '开放中' ? 'open' : ''}} {{tag == '已关闭' ? 'close' : ''}}">{{tag}}</view>
            </blcok>
          </view>
        </view>
      </block>
    </view>
    <empty wx:else msg="您暂时没有反馈数据"></empty>
  </view>
</template>

<script>
  import wepy from "wepy";
  import Empty from "components/empty";
  import ExamMixin from "mixins/exam";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import DataMixin from "mixins/data";
  export default class FeedBackList extends wepy.page {
    config = {
      navigationBarTitleText: '我的反馈',
      enablePullDownRefresh: true,
    }
    components = {
      empty: Empty,
    };
    data = {
      feedbacks: []
    }
    mixins = [HttpMixin, ToastMixin, DataMixin];
    async get() {
      try {
        const resp = await this.GET("/user/feedbacks")
        let feedbacks = resp.data
        for (let i = 0; i < feedbacks.length; i++) {
          const e = feedbacks[i];
          e.tagArr = [e.stat === "open" ? "开放中" : "已关闭"].concat(e.tags.split(","))
        }
        this.feedbacks = feedbacks
        this.$apply()
        this.InitSet("feedbacks", feedbacks)
      } catch (error) {
        console.log(error);
      }
    }
    async onPullDownRefresh() {
      try {
        await this.get()
      } catch (error) {
        console.log(error);
      }
      wepy.stopPullDownRefresh()
    }
    methods = {
      to(id) {
        wepy.navigateTo({
          url: "/pages/my/feedbackDetail?id=" + id
        });
      }
    }
    async onLoad() {
      this.Init("feedbacks")
    }
  }
</script>
