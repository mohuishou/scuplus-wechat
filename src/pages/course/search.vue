<style lang="less">
  @import "./src/less/config";
  page {
    font-size: 28rpx;
    width: 100%;
    background: @bg-color;
    >view {
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
      ;
      color: #fff;
      font-size: 28rpx;
    }
  }
  .main {
    z-index: 100;
    padding-top: 120rpx;
  }
</style>

<template>
  <view>
    <view class="search">
      <input @confirm="search" @blur="changeSearch" name="name" placeholder="请输入课程名称" confirm-type="search" auto-focus/>
      <button @tap="search">搜索</button>
    </view>
    <scroll-view style="height: {{height}}px;" scroll-y class="main" @scrolltolower="more">
      <repeat for="{{courses}}" item="data" key="index">
        <Card :item.sync="data"></Card>
      </repeat>
    </scroll-view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import Card from "components/course/card"
  const callTypes = ["", "不点名", "偶尔点名", "抽点", "全点"]
  const examTypes = ["", "论文", "考试", "大作业", "其他"]
  const taskTypes = ["", "没作业", "有作业"]
  export default class CourseLists extends wepy.page {
    config = {
      navigationBarTitleText: '课程搜索',
    };
    mixins = [HttpMixin, ToastMixin];
    components = {
      Card: Card,
    };
    data = {
      courses: [],
      page: 1,
      page_size: 15,
      name: "",
      height: 500,
    }
    newCourse(courses) {
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        courses[i].call_name = callTypes[courses[i].call_name]
        courses[i].task = taskTypes[courses[i].task]
        courses[i].exam_type = examTypes[courses[i].exam_type]
        let teachers = courses[i].teacher.split(",")
        let is_more = teachers.length > 1 ? '等' : ''
        courses[i].teacher = teachers[0] + is_more
      }
      return courses
    }
    async searchCourse() {
      const resp = await this.PostWithBind("/course/search", {
        page: this.page,
        page_size: this.page_size,
        name: this.name,
      })
      if (this.page > 1) {
        this.courses = this.courses.concat(this.newCourse(resp.data))
      } else {
        this.courses = this.newCourse(resp.data)
      }
      this.$apply()
    }
    methods = {
      changeSearch(e) {
        this.name = e.detail.value
      },
      more() {
        this.page++;
        this.searchCourse()
      },
      search() {
        this.searchCourse()
      }
    }
    onLoad() {
      this.height = wx.getSystemInfoSync().screenHeight - 61
    }
  }
</script>
