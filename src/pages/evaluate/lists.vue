<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 30rpx;
}
.header {
  display: flex;
  justify-content: space-between;
  .status {
    width: 50rpx;
  }
}
.info {
  display: flex;
  color: #888;
  font-size: 26rpx;
  margin-top: 20rpx;
  .teacher {
    margin-right: 15rpx;
  }
}
.term-title {
  color: #888;
  font-size: 26rpx;
  margin: 20rpx 20rpx 0rpx 20rpx;
}
.ad {
  margin-top: 20rpx;
  padding: 0 20rpx;
  ad {
    border-radius: 6rpx;
  }
}
</style>
<template minapp="wepy">
  <view>
    <block wx:for="{{items}}" wx:for-item="term" wx:for-index="i" wx:key="i">
      <view class="term-title">
        {{term.name}}
      </view>
      <block wx:for="{{term.value}}" wx:key="index">
        <view class="ad" wx:if="{{adShow && index !=0 && index % 8 == 0}}">
          <ad unit-id="adunit-ed4290e57794aa57"></ad>
        </view>

        <view @tap="to({{item.id}})" class="mo-panel">
          <view class="header">
            <view class="title">{{item.course_name}}</view>
            <view class="status">
              <view wx:if="{{item.status == 1}}" class="iconfont icon-search"></view>
              <view wx:else class="iconfont icon-edit"></view>
            </view>
          </view>
          <view class="info">
            <view class="teacher">{{item.teacher_name}}</view>
            <view class="type">{{item.evaluate_type}}</view>
          </view>
        </view>
      </block>
    </block>
    <list-bottom :isLast.sync="is_last"></list-bottom>
  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import ListBottom from "components/listBottom";
import ADConfig from "util/ad";
export default class CourseLists extends wepy.page {
  config = {
    navigationBarTitleText: "快捷评教",
    enablePullDownRefresh: true
  };
  mixins = [HttpMixin, ToastMixin];
  components = {
    "list-bottom": ListBottom
  };
  data = {
    items: [{}],
    params: {
      page: 1,
      page_size: 15
    },
    is_last: false
  };
  computed = {
    adShow() {
      return ADConfig.Get("evaluate");
    }
  };
  methods = {
    to(id) {
      wepy.navigateTo({
        url: "/pages/course/comment?from=evaluate&id=" + id
      });
    }
  };

  onReachBottom() {
    if (this.is_last) return;
    this.params.page++;
    this.get();
  }

  // 下拉刷新，更新列表
  async onPullDownRefresh() {
    try {
      this.params.page = 1;
      await this.POST("/evaluates");
      await this.get();
    } catch (error) {
      console.error(error);
    }
    wepy.stopPullDownRefresh();
  }

  async get() {
    try {
      if (this.params.page == 1) {
        this.is_last = false;
      }
      if (this.is_last) {
        return;
      }
      const res = await this.GET("/evaluates", this.params);
      if (!res.data || res.data.length < this.params.page_size) {
        this.is_last = true;
      }

      let data = {};
      if (res.data) {
        res.data.forEach(e => {
          let key = `${e.year}-${e.term}`;
          if (!(key in data)) {
            data[key] = {
              name: `${e.year}年${["秋", "春"][e.term]}季学期`,
              value: []
            };
          }
          data[key].value.push(e);
        });
      }
      if (this.params.page == 1) {
        this.items = data;
      } else {
        for (const k in data) {
          if (k in this.items) {
            this.items[k].value = this.items[k].value.concat(data[k].value);
          } else {
            this.items[k] = data[k];
          }
        }
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
