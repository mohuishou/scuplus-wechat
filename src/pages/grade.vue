<style lang="less">
@import "./src/less/config.less";
page {
  background: @bg-color;
}
.grade {
  margin: 20rpx;
  margin-bottom: 120rpx;
}
.header {
  box-shadow: 4rpx 4rpx 10rpx #ddd;
  .none {
    text-align: center;
    background: #fff;
  }
  .grade-header {
    border-radius: 0.2rem;
    .title {
      display: flex;
      justify-content: space-between;
    }
  }
}
.grade-header {
  margin-top: 0.5rem;
  background: @base-color;
  color: #fff;
  text-align: center;
  padding: 0.5rem;
  .title {
    display: block;
  }
  .info {
    font-size: 0.7rem;
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
  }
}
.grade-lists {
  background: #fff;
  border-radius: 0.2rem;
  display: block;
  box-shadow: 4rpx 4rpx 4rpx #ddd;
  .grade-list {
    display: flex;
    color: #666;
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    &.select {
      background: #ddd !important;
    }
    &:nth-child(2n + 1) {
      background-color: #f8f8f8;
    }
    text {
      padding: 0.1rem;
      display: table-cell;
      flex: 1;
      &:nth-child(1) {
        flex: 4;
      }
    }
  }
}
.bottom-tabs {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  background: #fff;
  margin: 0;
  width: 100%;
  color: #555;
  height: 95rpx;
  .bottom-tab {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: all 0.5s;
    .iconfont {
      font-size: 38rpx;
    }
    .tab-name {
      font-size: 24rpx;
    }
    &.active {
      transition: all 0.5s;
      color: @base-color;
      .tab-name {
        transition: all 0.5s;
        font-size: 30rpx;
      }
    }
  }
}
.ad {
  margin-top: 20rpx;
  border-radius: 0.2rem;
  height: 100rpx;
}
</style>

<template>
  <view>
    <view class="grade">
      <view class="header">
        <view wx:if="{{avg!=null}}" class="grade-header">
          <view class="title">
            <view>
              <text>全部成绩</text>
            </view>
            <view>
              <view @tap="updateGrades" class="iconfont icon-update"></view>
            </view>
          </view>
          <view>
            <view class="info">
              <text>必修绩点：{{avg.required.gpa}}</text>
              <text>必修平均分：{{avg.required.grade}}</text>
            </view>
            <view class="info">
              <text>全部绩点：{{avg.all.gpa}}</text>
              <text>全部平均分：{{avg.all.grade}}</text>
            </view>
          </view>
        </view>
        <empty wx:else msg="暂无成绩信息，下拉更新">
        </empty>
      </view>

      <block wx:for="{{grades}}" wx:key="index">
        <view class="grade-lists">
          <view @tap="selectTerm({{index}},{{!item.grades[0].selected}})" class="grade-header">
            <text class="title">{{item.grades[0].term_name}}</text>
            <view>
              <view class="info">
                <text>必修绩点：{{item.avg.required.gpa}}</text>
                <text>必修平均分：{{item.avg.required.grade}}</text>
              </view>
              <view class="info">
                <text>全部绩点：{{item.avg.all.gpa}}</text>
                <text>全部平均分：{{item.avg.all.grade}}</text>
              </view>
            </view>
          </view>
          <view class="grade-list">
            <text>课程名</text>
            <text>分数</text>
            <text>绩点</text>
            <text>学分</text>
            <text>属性</text>
          </view>
          <block wx:for="{{item.grades}}" wx:key="{{j}}" wx:for-item="grade" wx:for-index="j">
            <view class="grade-list {{grade.selected ? 'select' : ''}}" @tap="select({{index}}, {{j}})">
              <text>{{grade.course_name}}</text>
              <text>{{grade.grade}}</text>
              <text>{{grade.gpa}}</text>
              <text>{{grade.credit}}</text>
              <text>{{grade.course_type}}</text>
            </view>
          </block>
        </view>
        <ad class="ad" wx-if="{{adShow && index === 2 }}" unit-id="adunit-d286588d6069ca38"></ad>
      </block>
    </view>
    <view class="bottom-tabs">
      <view @tap="calc({{1}})" class="bottom-tab {{bottom_active === 1 ? 'active' : ''}}">
        <view class="iconfont icon-calc"></view>
        <view class="tab-name">计算</view>
      </view>
      <view @tap="selectAll({{2}})" class="bottom-tab {{bottom_active === 2 ? 'active' : ''}}">
        <view class="iconfont icon-quanxuan"></view>
        <view class="tab-name">全选</view>
      </view>
      <view @tap="selectRequire({{3}})" class="bottom-tab {{bottom_active === 3 ? 'active' : ''}}">
        <view class="iconfont icon-kechengbiao"></view>
        <view class="tab-name">必修</view>
      </view>
      <view @tap="deleteSelect({{4}})" class="bottom-tab {{bottom_active === 4 ? 'active' : ''}}">
        <view class="iconfont icon-delete"></view>
        <view class="tab-name">清空</view>
      </view>
      <view @tap="help({{5}})" class="bottom-tab {{bottom_active === 5 ? 'active' : ''}}">
        <view class="iconfont icon-help"></view>
        <view class="tab-name">帮助</view>
      </view>
    </view>
  </view>
</template>

<script>
import wepy from "wepy";
import gradeUtil from "../util/grade";
import Empty from "../components/empty";
import HttpMixin from "../mixins/http";
import ToastMixin from "../mixins/toast";
import DataMixin from "../mixins/data";
import db from "../util/db";
import ADConfig from "util/ad";
export default class Grade extends wepy.page {
  config = {
    navigationBarTitleText: "我的成绩",
    enablePullDownRefresh: true
  };
  components = {
    empty: Empty
  };
  computed = {
    isGraduate() {
      return db.Get("user_type") == 1;
    },
    adShow() {
      return ADConfig.Get("grade");
    }
  };
  mixins = [HttpMixin, ToastMixin, DataMixin];
  data = {
    grades: null,
    avg: null,
    bottom_active: 1
  };
  calAllGrades() {
    let sum = {
      all: {
        grade: 0,
        credit: 0,
        gpa: 0
      },
      required: {
        grade: 0,
        credit: 0,
        gpa: 0
      }
    };
    let avg = {
      all: {
        grade: 0,
        gpa: 0
      },
      required: {
        grade: 0,
        gpa: 0
      }
    };
    this.grades.forEach(g => {
      sum.all.grade += g.sum.all.grade;
      sum.all.credit += g.sum.all.credit;
      sum.all.gpa += g.sum.all.gpa;
      sum.required.grade += g.sum.required.grade;
      sum.required.credit += g.sum.required.credit;
      sum.required.gpa += g.sum.required.gpa;
    });
    avg.all.gpa = (sum.all.gpa / sum.all.credit).toFixed(3);
    avg.all.grade = (sum.all.grade / sum.all.credit).toFixed(3);
    avg.required.gpa = (sum.required.gpa / sum.required.credit).toFixed(3);
    avg.required.grade = (sum.required.grade / sum.required.credit).toFixed(3);
    this.avg = avg;
    this.$apply();
  }
  Select(m, option, isRequired = false) {
    if (m < 0) {
      for (let m = 0; m < this.grades.length; m++) {
        const e = this.grades[m];
        for (let n = 0; n < e.grades.length; n++) {
          if (isRequired) {
            this.grades[m].grades[n].selected =
              this.grades[m].grades[n].course_type === "必修";
          } else {
            this.grades[m].grades[n].selected = option;
          }
        }
      }
    } else {
      const e = this.grades[m];
      for (let n = 0; n < e.grades.length; n++) {
        this.grades[m].grades[n].selected = option;
      }
    }
  }
  methods = {
    updateGrades() {
      if (this.isGraduate) {
        this.graduateUpdate();
      } else {
        this.updateGrade();
      }
    },
    select(i, j) {
      this.grades[i].grades[j].selected = !this.grades[i].grades[j].selected;
      this.$apply();
    },
    calc(i) {
      this.bottom_active = i;
      let grades = [];
      for (let m = 0; m < this.grades.length; m++) {
        const e = this.grades[m];
        for (let n = 0; n < e.grades.length; n++) {
          if (e.grades[n].selected) grades.push(e.grades[n]);
        }
      }
      const result = gradeUtil.calTermGrade(grades, 0);
      wepy.showModal({
        title: "计算结果",
        content: `您共选择${grades.length}门课程, 学分共计: ${
          result.sum.all.credit
        }; \r
        平均分: ${result.avg.all.grade}; \r
        平均绩点: ${result.avg.all.gpa}; \r`,
        showCancel: false
      });
    },
    selectTerm(m, option) {
      this.Select(m, option);
    },
    selectAll(i) {
      this.bottom_active = i;
      this.Select(-1, true);
    },
    selectRequire(i) {
      this.bottom_active = i;
      this.Select(-1, true, true);
    },
    help(i) {
      this.bottom_active = i;
      wepy.navigateTo({
        url: `details?id=3&&from=notice`
      });
    },
    deleteSelect(i) {
      this.bottom_active = i;
      this.Select(-1, false);
    }
  };

  get() {
    if (this.isGraduate) {
      this.graduateGet();
    } else {
      this.getGrade();
    }
  }

  async getGrade() {
    try {
      const resp = await this.GET("/user/grade");
      this.setGrades(resp.data, 1);
    } catch (error) {
      console.log(error);
    }
  }
  async graduateGet() {
    try {
      const resp = await this.GET("/graduate/grades");
      this.setGrades(resp.data, 2);
    } catch (error) {
      console.log(error);
    }
  }

  // 设置成绩
  setGrades(data, init = 1) {
    let grades = [];
    let map = {};
    let i = 0;
    data.forEach(e => {
      const term_key = `${e.year}${e.term}`;
      if (!(term_key in map)) {
        map[term_key] = i;
        i++;
        grades[map[term_key]] = [];
      }
      grades[map[term_key]].push(e);
    });
    grades = gradeUtil.cal(grades, init);
    this.grades = grades;
    this.$apply();
    this.calAllGrades();
    this.InitSet("grades", grades);
  }

  // 更新成绩
  async graduateUpdate() {
    try {
      await this.POST("/graduate/grades");
      this.get();
    } catch (error) {
      console.log(error);
    }
    wepy.stopPullDownRefresh();
  }
  async updateGrade() {
    try {
      await this.POST("/user/grade");
      this.get();
    } catch (error) {
      console.log(error);
    }
    wepy.stopPullDownRefresh();
  }
  onPullDownRefresh() {
    if (this.isGraduate) {
      this.graduateUpdate();
    } else {
      this.updateGrade();
    }
  }
  async onLoad() {
    await this.Init("grades");
    this.calAllGrades();
  }
}
</script>

