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
  }
</style>

<template>
  <view>
    <view wx:if="{{feedbacks.length > 0}}" class="lists">
      <block wx:for="{{feedbacks}}" wx:key="{{index}}">
        <view class="list" @tap="to({{item.number}})">{{item.title}}</view>
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
        this.feedbacks = resp.data
        this.$apply()
        this.InitSet("feedbacks", resp.data)
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
