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
    min-height: 150rpx;
    border-bottom: 2rpx solid #ededed;
    display: flex;
    align-content: space-between;
    flex-wrap: wrap;
    color: #555;
    .title {
      width: 100%;
      font-size: 28rpx;
    }
    .info {
      color: #999;
      width: 100%;
      margin-top: 0.5rem;
      font-size: 24rpx;
      display: flex;
      justify-content: space-between;
      text {
        display: inline-block;
        margin-right: 0.2rem;
      }
    }
  }
}
.empty {
  padding-top: 2rem;
}
</style>

<template>
  <scroll-view style="height:{{height}}px" @scrolltolower="updateLists" enable-back-to-top scroll-y scroll-top="{{scrollTop}}" lower-threshold="80">
    <view style="{{isTag != '' ? 'margin-top: 0px;' : '' }}" class="lists">
      <block wx:for="{{details}}" wx:key="{{item.id}}">
        <ad wx:if="{{adShow && index == 6 }}" unit-id="adunit-b7c8a72749643459"></ad>
        <view @tap="toDetail({{item.id}})" class="list">
          <view class="title">
            {{item.title}}
          </view>
          <view class="info">
            <view class="tags">
              <block wx:for="{{item.tags}}" wx:for-item="tag" wx:key="{{tag.id}}">
                <text class="tag">#{{tag.name}}</text>
              </block>
            </view>
            <view class="time">{{item.created_at}}</view>
          </view>
        </view>
      </block>
      <empty class="empty" wx:if="{{isNone}}" msg="没有数据了"></empty>
      <ad wx:if="{{adShow && isNone }}" unit-id="adunit-b7c8a72749643459"></ad>
    </view>
  </scroll-view>
</template>

<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import Empty from "components/empty";
import ADConfig from "util/ad";
export default class List extends wepy.page {
  mixins = [HttpMixin, ToastMixin];
  components = {
    empty: Empty
  };
  props = {
    params: {
      type: Object,
      default: {
        tag_name: ""
      }
    },
    isTag: {
      type: String,
      default: "",
      twoWay: true
    }
  };
  data = {
    page: 1,
    page_size: 20,
    details: [],
    height: 520,
    scrollTop: 0,
    isNone: false
  };
  computed = {
    adShow() {
      return ADConfig.Get("newsLists");
    }
  };
  methods = {
    updateLists() {
      this.page++;
      this.getDetails();
    },
    toDetail(id) {
      wepy.navigateTo({
        url: `details?id=${id}&&from=news`
      });
    },
    toTagLists(tag) {
      wepy.navigateTo({
        url: `tagLists?id=${tag.id}&&name=${tag.name}`
      });
    },
    getNewDetails(page) {
      this.page = page || this.page;
      this.isNone = false;
      // scrollTop 值必须要有变化，不然的话没有效果
      this.scrollTop = 1;
      setTimeout(() => {
        this.scrollTop = 0;
        this.details = [];
        this.getDetails();
      }, 200);
    }
  };
  async getDetails() {
    if (this.isNone && this.page != 1) return;
    try {
      const resp = await this.GET(
        "/details",
        Object.assign(
          {
            page: this.page,
            page_size: this.page_size
          },
          this.params
        )
      );
      if (resp.data.data.length == 0) {
        this.isNone = true;
        this.ShowToast("没有数据了");
        this.$apply();
        return;
      }
      for (let i = 0; i < resp.data.data.length; i++) {
        resp.data.data[i].created_at = this.timeParser(
          resp.data.data[i].created_at
        );
      }
      if (this.page != 1) {
        this.details = this.details.concat(resp.data.data);
      } else {
        this.details = resp.data.data;
      }
      this.$apply();
    } catch (err) {}
  }
  timeParser(t) {
    let date = new Date(Date.parse(t));
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    let h = date.getHours();
    let minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    return y + "-" + m + "-" + d + " " + h + ":" + minute;
  }
  onLoad() {
    try {
      setTimeout(() => {
        this.getDetails();
      }, 100);
      this.height = wx.getSystemInfoSync().screenHeight;
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
