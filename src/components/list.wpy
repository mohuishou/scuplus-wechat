<style lang="less">
  @base-color: #f06292;
  scroll-view {
    height: 100%;
    background: #eee;
  }
  .lists {
    margin-top: 2rem;
    .list {
      padding: 0.5rem;
      background: #fff;
      margin-bottom: 0.5rem;
      .title {
        font-size: 0.8rem;
      }
      .info {
        margin-top: 0.5rem;
        font-size: 0.6rem;
        display: flex;
        justify-content: space-between;
        text {
          display: inline-block;
          margin-right: 0.2rem;
        }
      }
    }
  }
</style>

<template>
  <scroll-view style="height:{{isTag != '' ? height : ''}}px" @scrolltolower="updateLists" enable-back-to-top scroll-y>
    <view style="{{isTag != '' ? 'margin-top: 0px;' : '' }}" class="lists">
      <block wx:for="{{details}}" wx:key="{{item.id}}">
        <view class="list">
          <view @tap="toDetail({{item.id}})" class="title">
            {{item.title}}
          </view>
          <view class="info">
            <view class="tags">
              <text>{{item.category}}</text>
              <block wx:for="{{item.tags}}" wx:for-item="tag" wx:key="{{tag.id}}">
                <text class="tag" @tap="toTagLists({{tag}})">#{{tag.name}}</text>
              </block>
            </view>
            <view class="time">{{item.created_at}}</view>
          </view>
        </view>
      </block>
    </view>
  </scroll-view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "../mixins/http";
  import ToastMixin from "../mixins/toast";
  export default class List extends wepy.page {
    mixins = [HttpMixin, ToastMixin]
    components = {}
    props = {
      params: {
        type: Object,
        default: {
          category: ""
        }
      },
      isTag: {
        type: String,
        default: "",
        twoWay: true
      }
    }
    data = {
      page: 1,
      page_size: 20,
      details: [],
      height: 500,
    };
    methods = {
      scroll(e) {
        console.log(e);
      },
      updateLists() {
        this.page++;
        this.getDetails()
      },
      toDetail(id) {
        wepy.navigateTo({
          url: `details?id=${id}&&from=news`
        })
      },
      toTagLists(tag) {
        wepy.navigateTo({
          url: `tagLists?id=${tag.id}&&name=${tag.name}`
        })
      },
      getNewDetails(page) {
        if (page) this.page = page
        setTimeout(() => {
          this.getDetails()
        }, 100)
      }
    }
    async getDetails() {
      try {
        const resp = await this.GET("/details", Object.assign({
          page: this.page,
          page_size: this.page_size,
        }, this.params))
        for (let i = 0; i < resp.data.data.length; i++) {
          resp.data.data[i].created_at = this.timeParser(resp.data.data[i].created_at)
        }
        if (this.page != 1) {
          this.details = this.details.concat(resp.data.data)
        } else {
          this.details = resp.data.data
        }
        this.$apply();
      } catch (err) {}
    }
    timeParser(t) {
      let date = new Date(Date.parse(t))
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      let minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    }
    onLoad() {
      setTimeout(() => {
        this.getDetails()
      }, 100)
      this.height = wx.getSystemInfoSync().windowHeight
    }
  }
</script>
