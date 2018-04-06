<style lang="less">
  @import url("../../less/config");
  page {
    background: #eee;
  }
  .search {
    margin: 80rpx auto;
    text-align: center;
    image {
      width: 200rpx;
      height: 200rpx;
    }
  }
  .search-input {
    text-align: left;
    &.has-result {
      position: fixed;
      z-index: 1000;
      top: 0;
      width: calc(~"100% - 1rem");
      padding: 0.5rem;
      margin: 0;
      transition: all 1s ease-in;
    }
    transition: all 1s ease-in;
    background: @white;
    width: calc(~"100% - 80rpx");
    padding: 20rpx;
    margin: 20rpx;
    display: flex;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.3rem;
    align-items: center;
    input {
      font-size: 15px;
      width: calc(~"100% - 20px");
    }
  }
  .results {
    width: 100%;
    margin-top: 2rem;
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
    <view class="{{books.length === 0 ? 'search' : ''}}">
      <image wx:if="{{books.length === 0}}" src="/icon/index/search.svg"></image>
      <view class="search-input {{books.length === 0 ? '' : 'has-result'}}">
        <input @blur="change" placeholder="请输入图书名称" confirm-type="search" />
        <icon type="search" size="18" />
      </view>
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
      loading: false
    };
    methods = {
      change(e) {
        this.getBooks(e.detail.value, false)
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
