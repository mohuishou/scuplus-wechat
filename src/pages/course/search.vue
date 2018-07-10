<style lang="less">
@import "./src/less/config";
page {
  font-size: 28rpx;
  width: 100%;
  background: @bg-color;
  padding-bottom: 100rpx;
  > view {
    width: 100%;
  }
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
  .search-type {
    display: flex;
    align-items: baseline;
    width: 130rpx;
    .iconfont {
      margin-left: 8rpx;
      font-size: 26rpx;
    }
  }
  input {
    width: calc(~"100% - 380rpx");
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
.main {
  z-index: 100;
  padding-top: 120rpx;
}
.add {
  width: 100%;
  color: #888;
  padding: 40rpx 0;
  text-align: center;
  font-size: 30rpx;
}
.add-schedule {
  position: fixed;
  bottom: 0;
  background: linear-gradient(90deg, @base-color, #ed5a65);
  width: 100%;
  color: #fff;
  text-align: center;
  padding: 30rpx 0;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  > view {
    flex: 1;
    text-align: center;
  }
  .order {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.ad {
  margin-top: 15rpx;
  padding-left: 15rpx;
  padding-right: 15rpx;
  ad {
    border-radius: 6rpx;
  }
}
.iconfont .asc {
  transition: all 0.5s ease;
  transform: rotateX(180deg);
}
</style>

<template>
  <view>
    <form @submit="submit">
      <view class="search">
        <view @tap="changeSearchType" class="search-type">
          <view class="name">
            {{searchType == 'name' ? '课程名' : '教师名' }}
          </view>
          <view class="iconfont icon-jiantouarrow483"></view>
        </view>
        <input @confirm="search" @blur="changeSearch" name="name" placeholder="请输入课程名称" confirm-type="search" auto-focus/>
        <button form-type="submit">搜索</button>
      </view>
    </form>

    <scroll-view style="height: {{height}}px;" scroll-y class="main" @scrolltolower="more">
      <repeat for="{{courses}}" item="data" key="index">
        <view class="ad" wx:if="{{adShow && index == 6}}">
          <ad unit-id="adunit-62acc878b4ddb2f5"></ad>
        </view>
        <Card :item.sync="data"></Card>
      </repeat>
      <view class="add" @tap="addCourse" wx:if="{{courses.length == 0 && from == 'add'}}">
        没有结果？点击添加自定义课程
      </view>
    </scroll-view>
    <view class="add-schedule">
      <view class="order" @tap="orderHandler">
        <view>
          {{orderNames[orderIndex]}}
        </view>
        <view class="iconfont icon-jiantouarrow483 {{orderIndex % 2 == 1 ? 'asc' : ''}}"></view>
      </view>
      <view @tap="addCourse" wx:if="{{from == 'add'}}" class="">自定义</view>
    </view>
  </view>
</template>

<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import Card from "components/course/card";
import ADConfig from "util/ad";
const callTypes = ["", "不点名", "偶尔点名", "抽点", "全点"];
const examTypes = ["", "论文", "考试", "大作业", "其他"];
const taskTypes = ["", "没作业", "有作业"];
const orders = ["star desc", "star asc", "avg_grade desc", "avg_grade asc"];
export default class CourseLists extends wepy.page {
  config = {
    navigationBarTitleText: "课程搜索"
  };
  mixins = [HttpMixin, ToastMixin];
  components = {
    Card: Card
  };
  computed = {
    adShow() {
      return ADConfig.Get("courseSearch");
    }
  };
  data = {
    courses: [],
    page: 1,
    page_size: 15,
    name: "",
    height: 500,
    from: "",
    isEmpty: false,
    searchType: "name",
    order: "star desc",
    orderNames: ["评价", "评价", "平均分", "平均分"],
    orderIndex: 0
  };
  newCourse(courses) {
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      courses[i].call_name = callTypes[courses[i].call_name];
      courses[i].task = taskTypes[courses[i].task];
      courses[i].exam_type = examTypes[courses[i].exam_type];
      courses[i].avg_grade = courses[i].avg_grade.toFixed(2);
      courses[i].fail_rate = (course.fail_rate * 100).toFixed(2);
      let teachers = courses[i].teacher.split(",");
      let is_more = teachers.length > 1 ? "等" : "";
      courses[i].teacher = teachers[0] + is_more;
    }
    return courses;
  }
  async searchCourse() {
    if (this.page > 1 && this.isEmpty) {
      this.ShowToast("已经到底了！");
      return;
    }
    if (this.page == 1) {
      this.isEmpty = false;
    }
    let params = {
      page: this.page,
      page_size: this.page_size,
      order: this.order
    };
    params[this.searchType] = this.name;
    const resp = await this.POST("/course/search", params);
    if (this.page > 1) {
      this.courses = this.courses.concat(this.newCourse(resp.data));
    } else {
      this.courses = this.newCourse(resp.data);
    }
    if (resp.data.length === 0) {
      this.isEmpty = true;
      this.ShowToast("没有搜索到课程，请更换关键词");
    }
    this.$apply();
  }
  methods = {
    orderHandler() {
      const self = this;
      wepy.showActionSheet({
        itemList: ["评价逆序", "评价顺序", "平均分逆序", "平均分顺序"],
        success: function(res) {
          self.orderIndex = res.tapIndex;
          self.order = orders[res.tapIndex];
          self.page = 1;
          self.$apply();
          if (self.name != "") {
            self.searchCourse();
          }
        }
      });
    },
    changeSearchType() {
      const self = this;
      wepy.showActionSheet({
        itemList: ["课程名", "教师名"],
        success: function(res) {
          if (res.tapIndex == 0) {
            self.searchType = "name";
          } else {
            self.searchType = "teacher_name";
          }
          self.$apply();
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    },
    addCourse() {
      // 跳转到自定义课程界面
      wepy.navigateTo({
        url: "/pages/addSchedule"
      });
    },
    changeSearch(e) {
      this.name = e.detail.value;
    },
    more() {
      this.page++;
      this.searchCourse();
    },
    submit(e) {
      this.name = e.detail.value.name;
      this.page = 1;
      this.searchCourse();
    },
    search(e) {
      this.name = e.detail.value;
      this.page = 1;
      this.searchCourse();
    }
  };
  onLoad(option) {
    if ("from" in option) {
      this.from = option.from;
    }
    this.height = wx.getSystemInfoSync().screenHeight - 61;
  }
}
</script>
