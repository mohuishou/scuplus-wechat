<style lang="less">
  @import url("../../less/config");
  page {
    background: @bg-color;
  }
  .search {
    position: fixed; // top: 0;
    padding: 10rpx 20rpx;
    background: #fff;
    width: 100%;
    z-index: 9999;
    display: flex;
    justify-content: space-between;
    height: 100rpx;
    align-items: center;
    border-bottom: 2rpx solid #ddd;
    input {
      width: calc(~"100% - 260rpx");
      font-size: 28rpx;
      padding: 10rpx;
      padding-left: 20rpx;
      height: 40rpx;
      background: #f6f6f6;
    }
    button {
      border-radius: 0;
      width: 150rpx;
      height: 60rpx;
      font-size: 28rpx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, @base-color, #ed5a65);
      color: #fff;
      font-size: 28rpx;
    }
  }
  .results {
    width: 100%;
    padding-top: 125rpx;
    .result {
      // margin-top: 0.5rem;
      border-bottom: 3rpx solid #eee;
      background: @white;
      display: flex;
      padding: 0.5rem;
      image {
        width: 4.5rem;
        height: 6rem;
        background-image: url(https://scuplus.oss-cn-shenzhen.aliyuncs.com/book.jpg);
        background-size: cover;
        background-position: center;
      }
      .info {
        width: calc(~"100% - 5.5rem");
        align-content: space-between;
        display: flex;
        margin-left: 0.5rem;
        flex-wrap: wrap;
        .row {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .press {
          font-size: 0.8rem;
          color: #888;
        }
      }
    }
  }
</style>

<template>
  <view>
    <view class="search">
      <input @blur="change" @confirm="search" name="name" placeholder="请输入图书名称" confirm-type="search" auto-focus/>
      <button @tap="search">搜索</button>
    </view>
    <scroll-view style="height:{{height}}px;" class="results" @scrolltolower="next" enable-back-to-top scroll-y>
      <block wx:for="{{books}}" wx:key="index">
        <view @tap="show({{item}})" class="result">
          <image lazy-load class="cover" src="{{item.cover}}"></image>
          <view class="info">
            <view class="row title">
              <view>{{item.title}}</view>
            </view>
            <view class="row press">
              <view>{{item.press}}</view>
              <view>{{item.author}}, {{item.publish_year}}</view>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
  import wepy from 'wepy'
  import HttpMixin from "../../mixins/http";
  import ToastMixin from "../../mixins/toast";
  export default class Search extends wepy.page {
    mixins = [HttpMixin, ToastMixin]
    components = {}
    config = {
      navigationBarTitleText: '图书搜索'
    };
    data = {
      books: [],
      next_page: '',
      height: 280,
      loading: false,
      name: "",
    };
    methods = {
      search(e) {
        if (e.detail.value) {
          this.name = e.detail.value
        }
        this.getBooks(this.name, false)
      },
      change(e) {
        this.name = e.detail.value
      },
      next(e) {
        this.getBooks('', true)
      },
      show(item) {
        let content = `索书号: ${item.number};\r\n`
        item.book_addresses.forEach(e => {
          content += `${e.address}: 馆藏 ${e.all_count},可借 ${e.loan_count};\r\n`
        })
        wepy.showModal({
          title: item.title,
          content: content,
          showCancel: false
        })
      }
    };
    async getBooks(keyword, isNext) {
      let nextPage = ''
      if (this.loading) return
      if (isNext) {
        nextPage = this.next_page
        if (nextPage === '') {
          this.ShowToast('已经到底了')
          return
        }
      }
      this.loading = true
      const resp = await this.POST('/library/search', {
        keyword: keyword,
        key_type: 'WRD',
        next_page: nextPage
      })
      this.loading = false
      if (resp.data.books.length === 0) {
        console.log("sadadas");
        this.ShowToast('没有搜索到图书')
        return
      }
      if (nextPage === '') {
        this.books = resp.data.books
      } else {
        this.books = this.books.concat(resp.data.books)
      }
      this.next_page = resp.data.next_url
      this.$apply()
    }
    onLoad() {
      this.height = wx.getSystemInfoSync().windowHeight - 36
    }
    onShareAppMessage(options) {
      return {
        title: '搜索书籍'
      }
    }
  }
</script>
