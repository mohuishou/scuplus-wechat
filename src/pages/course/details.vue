<style lang="less">
@import "./src/less/config";
page {
  background: @bg-color;
  font-size: 28rpx;
}
.panel {
  margin-top: 15rpx;
  margin-left: 15rpx;
  margin-right: 15rpx;
  padding: 20rpx 20rpx;
  border-radius: 4rpx;
  display: flex;
  border: 2rpx solid #eee;
  box-shadow: 2rpx 2rpx 4rpx #e8e8e8;
  background: #fff;
}
.course-card {
  flex-wrap: wrap;
  align-content: space-between;
  > view {
    width: 100%;
  }
  .info {
    display: flex;
    justify-content: space-between;
    .teacher {
      color: #888;
    }
  }
  .tags {
    .tag {
      border-radius: 6rpx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4rpx 12rpx;
      margin: 0rpx 10rpx 10rpx 0rpx;
      font-size: 26rpx;
      color: @base-color;
      border: 2rpx solid @base-color;
    }
  }
}
.address {
  display: block;
  .row {
    margin-top: 20rpx;
    display: flex;
    &:first-child {
      margin-top: 0;
    }
  }
  .title {
    color: #888;
    line-height: 200%;
    width: 90rpx;
  }
  .address-list {
    width: calc(~"100% - 100rpx");
    line-height: 200%;
    display: flex;
    > view {
      &:first-child {
        margin-right: 20rpx;
      }
    }
  }
}
.course-info {
  flex-wrap: wrap;
  height: auto;
  .left {
    width: calc(~"100% - 240rpx");
  }
  .right {
    width: 240rpx;
  }
  > view {
    display: flex;
    margin-top: 15rpx;
    width: 100%;
    &:first-child {
      margin-top: 0;
    }
    .title {
      color: #888;
      width: 160rpx;
      min-width: 160rpx;
    }
    > view {
      display: flex;
    }
  }
}
.course-eva {
  height: 50rpx;
  align-items: center;
  > view {
    text-align: center;
    flex: 1;
    &:nth-child(2) {
      border-left: 3rpx solid #ddd;
      border-right: 3rpx solid #ddd;
    }
  }
}
.header {
  color: #888;
  margin-top: 20rpx;
  margin-left: 20rpx; // text-align: center;
}
.comments {
  height: auto;
  flex-wrap: wrap;
  margin-bottom: 120rpx;
  .comment {
    width: 100%;
    border-bottom: 2rpx solid #ddd;
    padding-bottom: 20rpx;
    padding-top: 20rpx;
    .comment-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
      .user {
        display: flex;
      }
      .avatar {
        width: 60rpx;
        height: 60rpx;
        background-position: center;
        background-size: cover;
        margin-right: 10rpx;
        border-radius: 50%;
      }
      .time {
        color: #888;
        font-size: 24rpx;
      }
      .star {
        display: flex;
        color: #555;
        align-items: baseline;
        &.is-zan {
          color: @base-color;
        }
        .iconfont {
          margin-right: 10rpx;
        }
      }
    }
    .content {
      margin-top: 10rpx;
      font-size: 26rpx;
    }
  }
}
.new-comment {
  display: flex;
  z-index: 9999;
  position: fixed;
  bottom: 0;
  background: @base-color;
  width: 100%;
  color: #fff;
  text-align: center;
  padding: 30rpx 0;
  font-size: 30rpx;
  cover-view {
    flex: 1;
    text-align: center;
  }
}

.course-chart {
  display: block;
  height: 750rpx;
  width: calc(~"100% - 70rpx");

  .chart-header {
    text-align: center;
    z-index: 10;
    margin-top: 20rpx;
    line-height: 150%;
    .chart-title {
      font-size: 30rpx;
      font-weight: bold;
    }
    .chart-subtitle {
      font-size: 26rpx;
      color: #888;
    }
  }
  .chart-info {
    font-size: 26rpx;
    color: #888;
    line-height: 150%;
  }
  canvas {
    height: 280px;
    width: 100%;
  }
}

ad {
  margin-top: 20rpx;
}

.btn {
  background-color: transparent;
  padding: 0;
  margin: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  padding-left: 0;
  padding-right: 0;
  border-radius: 0;
  font-size: 0rpx;
  &::after {
    content: "";
    width: 0;
    height: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
    display: none;
    background-color: transparent;
  }
}
</style>

<template>
  <view>
    <Card :item.sync="item" :isTo.sync="isTo"></Card>
    <view class="address panel">
      <block wx:for="{{courses}}" wx:for-item="course_items" wx-for-index="i" wx:key="i">
        <view class="row">
          <view class="title">
            <view>时间</view>
            <view>地点</view>
          </view>
          <view class="address-list">
            <block wx:for="{{course_items}}" wx:key="index">
              <view>
                <view>{{item.week}}周{{item.day_str}} {{item.session_str}}小节</view>
                <view>{{item.campus}}{{item.building}} {{item.classroom}}</view>
              </view>
            </block>
          </view>
        </view>
      </block>
    </view>
    <view class="course-info panel">
      <view>
        <view class="left">
          <view class="title">
            <view>课程号</view>
          </view>
          <view>
            <view>{{course.courses[0].course_id}}</view>
          </view>
        </view>
        <view class="right">
          <view class="title">
            <view>学分</view>
          </view>
          <view>
            <view>{{course.courses[0].credit}}</view>
          </view>
        </view>
      </view>
      <view>
        <view class="left">
          <view class="title">
            <view>课序号</view>
          </view>
          <view>
            <view>{{course.courses[0].lesson_id}}</view>
          </view>
        </view>
        <view class="right">
          <view class="title">
            <view>考试类型</view>
          </view>
          <view>
            <view>{{course.courses[0].exam_type}}</view>
          </view>
        </view>
      </view>
      <view>
        <view class="title">
          <view>学院</view>
        </view>
        <view>
          <view>{{course.courses[0].college}}</view>
        </view>
      </view>
      <view>
        <view class="title">
          <view>教师</view>
        </view>
        <view>
          <view>{{course.course_count.teacher_all}}</view>
        </view>
      </view>
      <view>
        <view class="title">
          <view>选课限制</view>
        </view>
        <view>
          <view>{{course.courses[0].course_limit}}</view>
        </view>
      </view>
    </view>
    <view class="header">
      成绩分布
    </view>
    <view class="course-chart panel">
      <view class="chart-header">
        <view class="chart-title">成绩分布</view>
        <view class="chart-subtitle">一共统计{{grade_count.all}}位用户的成绩信息</view>
      </view>
      <canvas canvas-id="pieCanvas" class="canvas"></canvas>
      <view class="chart-info">
        该信息仅表示We川大用户的统计信息，仅作参考，无法表示老师最终的成绩
      </view>
    </view>
    <view class="header">
      课程评价
    </view>
    <view class="course-eva panel">
      <view>
        很赞 {{item.good}}
      </view>
      <view>
        一般 {{item.normal}}
      </view>
      <view>
        不好 {{item.bad}}
      </view>
    </view>

    <view class="comments panel">
      <block wx:for="{{evaluates}}" wx:key="index">
        <view class="comment">
          <view class="comment-info">
            <view class="user">
              <view class="avatar" style="background-image: url('{{item.avatar}}');">
              </view>
              <view>
                <view class="username">{{item.nick_name || '某同学'}}</view>
                <view class="time">{{item.updated_str}}</view>
              </view>
            </view>
            <!-- 点赞暂时去除 -->
            <!-- <view class="star is-zan">
                                                      <view class="iconfont icon-unie60b"></view>
                                                      <text>{{item.score}}</text>
                                                    </view> -->
          </view>
          <view class="content">
            {{item.comment}}
          </view>
        </view>
      </block>
      <view wx:if="{{evaluates.length == 0}}" style="text-align: center; color: #888;width: 100%;">
        暂无评论
      </view>
      <!-- <ad wx:if="{{adShow}}" unit-id="adunit-980940e6a5b9ca5b"></ad> -->
    </view>
    <cover-view class="new-comment">
      <cover-view wx:if="{{course.evaluate.id > 0}}" @tap="newComment">
        {{ course.evaluate.status == -1 ? "添加评价" : "编辑评价" }}
      </cover-view>
      <!-- 课程表没有该课程 -->
      <cover-view wx:if="{{!course.has}}" @tap="changeSchedule" class="no-comment">
        {{ inSchedule ? "删除课程" : "添加到我的课表"}}
      </cover-view>
    </cover-view>
  </view>
</template>

<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import db from "util/db";
import DataMixin from "mixins/data";
import Card from "components/course/card";
import wxCharts from "plugins/wxcharts-min.js";
import ADConfig from "util/ad";
import dayjs from "dayjs";
const callTypes = ["", "不点名", "偶尔点名", "抽点", "全点"];
const examTypes = ["", "论文", "考试", "大作业", "其他"];
const taskTypes = ["", "没作业", "有作业"];
let pieChart = null;
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
      return ADConfig.Get("courseDetail");
    }
  };
  data = {
    options: {},
    course: {},
    item: {},
    courses: {},
    isTo: false,
    evaluates: [],
    inSchedule: false,
    grade_count: {
      all: 0,
      g0: 0,
      g60: 0,
      g70: 0,
      g80: 0,
      g90: 0
    }
  };

  // initGradeCount 成绩统计信息初始化
  initGradeCount() {
    let grade_count = {
      all: 0,
      g0: 0,
      g60: 0,
      g70: 0,
      g80: 0,
      g90: 0
    };
    this.course.course_grades.forEach(e => {
      for (const x in grade_count) {
        if (x == "all") continue;
        grade_count[x] += e[x];
        grade_count.all += e[x];
      }
      this.grade_count = grade_count;
      this.$apply();
    }, this);
  }

  // 统计图绘制
  initChart() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth - 35;
    } catch (e) {
      console.error("getSystemInfoSync failed!");
    }

    this.initGradeCount();
    const grades = this.grade_count;
    let series = [
      {
        name: "数据不足",
        data: 1,
        color: "#ddd"
      }
    ];

    if (this.grade_count.all > 0) {
      series = [
        {
          name: "0~60",
          data: grades.g0
        },
        {
          name: "60~70",
          data: grades.g60
        },
        {
          name: "70~80",
          data: grades.g70
        },
        {
          name: "80~90",
          data: grades.g80
        },
        {
          name: "90~100",
          data: grades.g90
        }
      ];
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: "pieCanvas",
      type: "pie",
      series: series,
      width: windowWidth,
      height: 280,
      disablePieStroke: true,
      dataLabel: true
    });
  }
  newCourseCount(course) {
    course.call_name = callTypes[course.call_name];
    course.task = taskTypes[course.task];
    course.exam_type = examTypes[course.exam_type];
    course.avg_grade = course.avg_grade.toFixed(2);
    course.fail_rate = (course.fail_rate * 100).toFixed(2);
    course.teacher_all = course.teacher;
    let teachers = course.teacher.split(",");
    let is_more = teachers.length > 1 ? "等" : "";
    course.teacher = teachers[0] + is_more;
    return course;
  }
  newCourse(courses) {
    for (let i = 0; i < courses.length; i++) {
      courses[i].course_name = courses[i].name;
      // 计算上课节次
      let sessions = courses[i].session.split(",");
      if (sessions.length > 1) {
        courses[i].session_str =
          sessions[0] + "-" + sessions[sessions.length - 1];
      }
      // 计算上课时间
      courses[i].day_str = ["", "一", "二", "三", "四", "五", "六", "七"][
        courses[i].day
      ];
      // 计算上课周次
      let week = "";
      let weeks = courses[i].all_week.split(",");
      if (weeks.length > 0) {
        let start = weeks[0];
        let prev = weeks[0];
        for (let j = 1; j < weeks.length; j++) {
          const e = weeks[j];
          if (e != prev - 0 + 1) {
            if (weeks[j - 1] > start) {
              week += start + "-" + weeks[j - 1] + ",";
            } else {
              week += start + ",";
            }
            start = e;
          }
          prev = e;
        }

        if (weeks[weeks.length - 1] - start > 0) {
          week += start + "-" + weeks[weeks.length - 1];
        } else {
          week += start;
        }
      }
      courses[i].week = week;
    }

    // 一位数组变二维，一行只放两个上课节次
    let newCourses = [[]];
    courses.forEach(e => {
      if (newCourses[newCourses.length - 1].length >= 2) {
        newCourses.push([]);
      }
      newCourses[newCourses.length - 1].push(e);
    });
    return newCourses;
  }
  newEvaluate(evaluates) {
    for (let i = 0; i < evaluates.length; i++) {
      evaluates[i].avatar =
        evaluates[i].avatar ||
        "http://scuplus-1251451068.coscd.myqcloud.com/icon/user@select.png";
      evaluates[i].updated_str = dayjs(evaluates[i].updated_at).format(
        "YYYY-MM-DD HH:mm"
      );
    }
    return evaluates;
  }
  methods = {
    changeSchedule() {
      // 检查是否已经拥有该课程
      let items = db.Get("myScheduleItems") || [];
      const self = this;
      if (this.inSchedule) {
        wepy.showModal({
          title: "确认删除", //提示的标题
          content: "是否从我的课表删除该门课程", //提示的内容
          showCancel: true, //是否显示取消按钮
          success: res => {
            if (res.confirm) {
              for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (
                  item.course_id == self.item.course_id &&
                  item.lesson_id == self.item.lesson_id
                ) {
                  items.splice(i, 1);
                }
              }
              self.inSchedule = false;
              db.Set("myScheduleItems", items);
              self.ShowToast("删除成功！");
              self.$apply();
            }
          }
        });
      } else {
        db.Set("myScheduleItems", items.concat(this.course.courses));
        wepy.navigateTo({
          url: "/pages/schedule"
        });
      }
    },
    newComment() {
      // 检查是否拥有权限
      wepy.navigateTo({
        url: "/pages/course/comment?id=" + this.course.evaluate.id
      });
    }
  };
  async init() {
    const resp = await this.GET("/course", this.options);
    this.course = resp.data;
    this.item = this.newCourseCount(resp.data.course_count);
    this.courses = this.newCourse(resp.data.courses);
    this.evaluates = this.newEvaluate(resp.data.course_evaluates);
    wepy.setNavigationBarTitle({
      title: this.item.name
    });
    // 判断自定义课程是否添加了该门课程
    const items = db.Get("myScheduleItems") || [];
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (
          item.course_id == this.item.course_id &&
          item.lesson_id == this.item.lesson_id
        ) {
          this.inSchedule = true;
          break;
        }
      }
    }

    // 初始化图表
    this.initChart();
    this.$apply();
  }
  onShow() {
    if (this.options) {
      this.init();
    }
  }
  async onLoad(options) {
    this.options = options;
    // this.init()
  }
  onShareAppMessage(options) {
    return {
      title: "我发现一门超级棒的课程"
    };
  }
}
</script>
