<style lang="less">
  @import url("../../less/config");
  page {
    background: @bg-color;
    width: 100%;
    height: 100%;
  }
  .book {
    color: #333;
    margin: 26rpx 26rpx 0 26rpx;
    background: @white;
    border-radius: 4rpx;
    box-shadow: 4rpx 4rpx 20rpx #ddd;
    padding: 20rpx;
    display: flex;
    align-content: space-between;
    flex-wrap: wrap;
    >view {
      width: 100%;
    }
    .info {
      margin-top: 10rpx;
      justify-content: space-between;
      align-items: center;
      display: flex;
      color: #666;
      font-size: 0.8rem;
    }
    .warn {
      color: @base-color;
    }
  }
  .none {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #888;
    font-size: 2rem;
    text-align: center;
  }
</style>

<template>
  <view wx:if="{{loan_books.length!=0}}">
    <block wx:for="{{loan_books}}" wx:key="{{index}}">
      <view class="book">
        <view class="title">{{item.title}}-{{item.author}}</view>
        <view class="info">
          <view>到期: {{item.due_date}}</view>
          <view wx:if="{{item.arrearage>0}}" class="warn">欠费: {{item.arrearage}}</view>
          <view wx:if="{{loan_type=='now'}}" class="btn warn" @tap="loan({{item.book_id}})">续借</view>
          <view wx:if="{{loan_type=='history'}}">归还: {{item.return_date}}</view>
        </view>
      </view>
    </block>
  </view>
  <empty wx:else msg="暂无借阅数据">
  </empty>
</template>

<script>
  import wepy from 'wepy'
  import Empty from "components/empty";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import DataMixin from "mixins/data";
  import db from "util/db"
  export default class Loan extends wepy.page {
    config = {
      navigationBarTitleText: '我的借阅',
      enablePullDownRefresh: true
    };
    components = {
      empty: Empty,
    };
    mixins = [HttpMixin, ToastMixin, DataMixin];
    data = {
      loan_books: [],
      loan_now: [],
      loan_history: [],
      loan_type: 'now' // history
    };
    methods = {
      async loan(bookID) {
        const resp = await this.POST('/library/loan', {
          book_id: bookID
        })
        this.get()
        this.ShowToast('续借成功', 'success')
      }
    }
    watch = {
      loan_now(newVal, oldVal) {
        this.loan_books = newVal
      },
      loan_history(newVal, oldVal) {
        this.loan_books = newVal
      }
    }
    async get() {
      const t = this.loan_type === 'now' ? 0 : 1
      const resp = await this.GET('/library/books?is_history=' + t)
      this.loan_books = resp.data
      this.$apply()
      this.InitSet('loan_' + this.loan_type, resp.data)
    }
    async onPullDownRefresh() {
      try {
        await this.get()
        wepy.stopPullDownRefresh()
      } catch (error) {
        console.log(error);
      }
    }
    onLoad(options) {
      if (options.type && options.type === 'history') {
        this.loan_type = options.type
        wepy.setNavigationBarTitle({
          title: '历史借阅'
        })
      }
      this.Init('loan_' + this.loan_type)
    }
  }
</script>
