<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  padding-top: 120rpx;
  padding-bottom: 100rpx;
}
.search-top {
  width: 100%;
  position: fixed;
  top: 0;
}
picker {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.lists {
  font-size: 30rpx;
  .header {
    .title {
      font-size: 30rpx;
      &.active {
        color: @base-color;
      }
    }
    .info {
      margin-top: 20rpx;
      color: #888;
      font-size: 24rpx;
      display: flex;
      transition: all 0.3s ease-in-out;
      height: 30rpx;
      overflow: hidden;
      &.active {
        height: 0rpx;
        transition: all 0.3s ease-in-out;
      }
      > view {
        display: flex;
        margin-right: 8rpx;
        > view {
          margin-right: 8rpx;
        }
      }
    }
  }
  .content {
    transition: all 0.3s ease-in-out;
    height: 0;
    overflow: hidden;
    > view {
      padding-top: 20rpx;
      padding-bottom: 20rpx;
      border-bottom: 2rpx dashed #ddd;
      display: flex;
      .title {
        width: 120rpx;
        min-width: 120rpx;
      }
    }
  }
}
</style>

<template>
  <view>
    <search :autoFocus="auto_focus" class="search-top" @search.user="search" title="请输入标题"></search>
    <view class="lists">
      <view @tap="active({{index}})" wx:for="{{items}}" wx:key="index" class="mo-panel">
        <view class="header">
          <view class="title {{item.active ?  'active' : ''}}">{{item.title}}</view>
          <view class="info {{item.active ?  'active' : ''}}">
            <view>
              <view class="iconfont icon-shijian"></view>
              <view>{{item.start_time}}</view>
            </view>
            <view>
              <view class="iconfont icon-building"></view>
              <view>{{item.college}}</view>
            </view>
          </view>
        </view>
        <view class="content" style="height: {{item.active ? item.height : 0}}rpx;">
          <view>
            <view class="title">时间</view>
            <view>{{item.time}}</view>
          </view>
          <view>
            <view class="title">地点</view>
            <view>{{item.address}}</view>
          </view>
          <view>
            <view class="title">主讲人</view>
            <view>{{item.reporter}}</view>
          </view>
          <view>
            <view class="title">主办</view>
            <view>{{item.college}}</view>
          </view>
        </view>
      </view>
      <listBottom :isLast.sync="is_last"></listBottom>
    </view>
    <picker mode="date" value="{{start_time}}" @change="changeDate">
      <view class="picker mo-btn">
        {{start_time ? start_time+'之后的讲座报告' : '时间筛选'}}
      </view>
    </picker>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import Search from "components/search";
import ListBottom from "components/listBottom";
import dayjs from "dayjs";
export default class Lecture extends wepy.page {
  config = {
    navigationBarTitleText: "学术讲座"
  };

  mixins = [HttpMixin, ToastMixin];
  components = {
    search: Search,
    listBottom: ListBottom
  };
  data = {
    auto_focus: false,
    items: [
      {
        address: "望江校区经纬楼（经管楼）西202学术报告厅",
        college: "经济学院",
        id: 1,
        reporter: "洪永淼教授 “长江学者”讲座教授、厦门大学经济学院院长",
        start_time: "2018-06-11T00:00:00+08:00",
        time: "2018年06月10日 16：00-17：30",
        title: "构建中国特色国际政治经济学：中国立场、国际视野与现代方法",
        active: false,
        height: 400
      }
    ],
    title: "",
    page: 1,
    page_size: 10,
    start_time: "",
    is_last: false
  };

  methods = {
    search(title) {
      this.title = title;
      this.page = 1;
      this.is_last = false;
      this.start_time = ""
      this.searchLecture();
    },
    active(i) {
      this.items[i].active = !this.items[i].active;
    },
    changeDate(e) {
      this.start_time = e.detail.value;
      this.page = 1;
      this.is_last = false;
      this.select();
    }
  };

  select() {
    if (this.title == "") {
      this.get();
    } else {
      this.searchLecture();
    }
  }

  onReachBottom() {
    if (this.is_last) return;
    this.page++;
    this.select();
  }

  dataFormat(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].active = false;
      arr[i].start_time = dayjs(arr[i].start_time).format("YYYY-MM-DD");
      let count = 0;
      ["address", "reporter", "college"].forEach(e => {
        count += Math.ceil(arr[i][e].length / 16);
      });
      arr[i].height = 200 + 40 * count;
    }
    if (this.page === 1) {
      this.items = arr;
    } else {
      this.items = this.items.concat(arr);
    }
    if (arr.length < this.page_size) {
      this.is_last = true;
    }
    this.$apply();
    return arr;
  }

  async searchLecture() {
    try {
      const res = await this.POST("/lectures/search", {
        page: this.page,
        page_size: this.page_size,
        title: this.title,
        start_time: this.start_time
      });
      this.dataFormat(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async get() {
    try {
      const res = await this.GET("/lectures", {
        page: this.page,
        page_size: this.page_size,
        start_time: this.start_time
      });
      this.dataFormat(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  onLoad() {
    this.get();
  }
}
</script>
