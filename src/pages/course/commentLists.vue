<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  padding-top: 120rpx;
  font-size: 30rpx;
}
.search-top {
  width: 100%;
  position: fixed;
  top: 0;
}
.item{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .status {
    width: 50rpx;
  }
}
</style>
<template>
  <view>
    <search class="search-top" :autoFocus="auto_focus" @search.user="search" title="请输入标题"></search>
    <view class="lists">
      <block wx:for="{{items}}" wx:key="index">
        <view @tap="to({{item.id}})" class="mo-panel item">
          <view>{{item.course_name}}</view>
          <view class="status">
            <view wx:if="{{item.status == 1}}" class="iconfont icon-search"></view>
            <view wx:else class="iconfont icon-edit"></view>
          </view>
        </view>
      </block>
      <list-bottom :isLast.sync="is_last"></list-bottom>
    </view>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import ListBottom from "components/listBottom";
import Search from "components/search";
export default class CourseLists extends wepy.page {
  config = {
    navigationBarTitleText: "课程评价"
    // enablePullDownRefresh: true
  };
  mixins = [HttpMixin, ToastMixin];
  components = {
    search: Search,
    "list-bottom": ListBottom
  };

  data = {
    items: [],
    page: 1,
    page_size: 15,
    name: "",
    is_last: false,
    auto_focus: false,
  };

  methods = {
    search(name) {
      this.name = name;
      this.page = 1;
      this.is_last = false;
      this.get();
    },
    to(id) {
      wepy.navigateTo({ url: "/pages/course/comment?id=" + id });
    }
  };

  onReachBottom() {
    if (this.is_last) return;
    this.page++;
    this.get();
  }

  async get() {
    try {
      if (this.is_last) {
        return;
      }
      const res = await this.GetWithBind("/course/comments", {
        page: this.page,
        page_size: this.page_size,
        name: this.name
      });
      if (res.data && res.data.length < this.page_size) {
        this.is_last = true;
      }
      if (this.page == 1) {
        this.items = res.data;
      } else {
        this.items = this.items.concat(res.data);
      }
      this.$apply();
    } catch (error) {
      console.error(error);
    }
  }

  onShow() {
    this.get();
  }
}
</script>
