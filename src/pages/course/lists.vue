<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
    width: 100%;
    height: 100%;
    >view {
      width: 100%;
      height: 100%;
    }
  }
  radio-group {
    margin: 20rpx;
    display: flex;
    align-items: baseline;
    .title {
      margin-right: 20rpx;
    }
    .radios {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      >label {
        margin-right: 20rpx;
        border-radius: 6rpx;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4rpx 12rpx;
        margin: 0rpx 20rpx 10rpx 0rpx;
        font-size: 28rpx;
        color: @base-color;
        border: 2rpx solid @base-color;
        &.checked {
          background: @base-color;
          color: #fff;
        }
      }
    }
  }
  /*  重写 radio 样式  */
  radio .wx-radio-input {
    display: none;
  }
  .tabs {
    position: fixed;
    width: calc(~"100% - 50rpx");
    display: flex;
    background: #fff;
    font-size: 28rpx;
    padding: 0 20rpx;
    height: 30px;
    z-index: 100;
    .tab {
      text-align: center;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont {
        margin-left: 5rpx;
        transition: all 0.5s ease;
        &.asc {
          transition: all 0.5s ease;
          transform: rotateX(180deg);
        }
      }
      text {
        color: #888;
        font-size: 24rpx;
      }
    }
  }
  .main {
    padding-top: 30px;
  }
  .pop-right {
    font-size: 28rpx;
    width: 100%;
    z-index: 1000;
    height: 100%;
    position: fixed;
    display: flex;
    transition: all 0.5s ease-out;
    margin-right: -105%;
    background: #fff;
    right: 0;
    &.show {
      transition: all 0.5s ease-in;
      margin-right: 0%;
    }
    .header {
      position: fixed;
      background: #f6f6f6;
      width: 100%;
      padding: 20rpx;
    }
    .title {
      color: #888;
    }
    .form {
      margin-top: 100rpx;
      .card {
        border-bottom: 2rpx solid #ddd;
        margin-top: 20rpx;
        .title {
          font-size: 26rpx;
          color: #555;
          padding-left: 20rpx;
        }
      }
    }
    .footer {
      position: fixed;
      background: #f6f6f6;
      width: 100%;
      padding: 20rpx;
      bottom: 0;
      button {
        display: inline-block;
        margin-right: 20rpx;
        border: 2rpx solid @base-color;
        background: transparent;
        color: @base-color;
        font-size: 28rpx;
        &:hover {
          background: @base-color;
          color: #fff;
        }
      }
    }
  }
</style>

<template>
  <view>
    <view class="tabs">
      <view @tap="search" class="tab">
        <view class="iconfont icon-search"></view>
      </view>
      <view class="tab order" @tap="orderHandler">
        <view>
          {{orderNames[orderIndex]}}
        </view>
        <view class="iconfont icon-jiantouarrow483 {{orderIndex % 2 == 1 ? 'asc' : ''}}"></view>
      </view>
      <view class="tab" @tap="showFilter">
        筛选
      </view>
    </view>
    <view class="pop-right {{isShowFilter ? 'show' : ''}}">
      <form @submit="submit" @reset="reset">
        <view class="header">
          <view class="title">
            筛选
          </view>
        </view>
        <view class="form">
          <block wx:for="{{filters}}" wx:key="index">
            <view class="card">
              <view class="title">
                {{item.title}}
              </view>
              <radio-group name="{{item.name}}" class="radio-group">
                <view class="radios">
                  <block wx:for="{{item.radios}}" wx:key="i" wx:for-item="radio" wx:for-index="i">
                    <label @tap="checked({{index}},{{i}})" class="{{radio.checked ? 'checked' : ''}}"><radio value="{{radio.value}}" checked="{{radio.checked}}" />{{radio.name}}</label>
                  </block>
                </view>
              </radio-group>
            </view>
          </block>
        </view>
        <view class="footer">
          <button formType="submit">提交</button>
          <button formType="reset">重置</button>
          <button @tap="showFilter">关闭</button>
        </view>
      </form>
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
  import db from "util/db";
  import DataMixin from "mixins/data";
  import Card from "components/course/card"
  const callTypes = ["", "不点名", "偶尔点名", "抽点", "全点"]
  const examTypes = ["", "论文", "考试", "大作业", "其他"]
  const taskTypes = ["", "没作业", "有作业"]
  const orders = ["avg_grade desc", "avg_grade asc", "star desc", "star asc"]
  export default class CourseLists extends wepy.page {
    config = {
      navigationBarTitleText: '寻课',
    };
    mixins = [HttpMixin, ToastMixin];
    components = {
      Card: Card,
    };
    data = {
      isShowFilter: false,
      courses: [],
      page: 1,
      page_size: 15,
      height: 500,
      isEmpty: false,
      params: {
        call_name: "",
        task: "",
        exam_type: "",
        campus: "",
        day: "",
      },
      order: "avg_grade desc",
      orderNames: ["平均分", "平均分", "评价", "评价"],
      orderIndex: 0,
      filters: [{
          name: "call_name",
          title: "点名方式",
          radios: [{
              name: "全点",
              value: 4,
              checked: false
            },
            {
              name: "抽点",
              value: 3,
              checked: false
            }, {
              name: "偶尔点名",
              value: 2,
              checked: false
            },
            {
              name: "不点名",
              value: 1,
              checked: false
            }
          ]
        },
        {
          name: "exam_type",
          title: "考核方式",
          radios: [{
              name: "论文",
              value: 1,
              checked: false
            },
            {
              name: "考试",
              value: 2,
              checked: false
            }, {
              name: "大作业",
              value: 3,
              checked: false
            },
            {
              name: "其他",
              value: 4,
              checked: false
            }
          ]
        },
        {
          name: "task",
          title: "作业情况",
          radios: [{
              name: "有作业",
              value: 1,
              checked: false
            },
            {
              name: "没作业",
              value: 2,
              checked: false
            }
          ]
        },
        {
          name: "campus",
          title: "校区",
          radios: [{
              name: "江安",
              value: "江安",
              checked: false
            },
            {
              name: "望江",
              value: "望江",
              checked: false
            },
            {
              name: "华西",
              value: "华西",
              checked: false
            }
          ]
        },
        {
          name: "day",
          title: "上课日期",
          radios: [{
              name: "周一",
              value: 1,
              checked: false
            },
            {
              name: "周二",
              value: 2,
              checked: false
            },
            {
              name: "周三",
              value: 3,
              checked: false
            },
            {
              name: "周四",
              value: 4,
              checked: false
            },
            {
              name: "周五",
              value: 5,
              checked: false
            },
            {
              name: "周六",
              value: 6,
              checked: false
            },
            {
              name: "周日",
              value: 7,
              checked: false
            }
          ]
        },
      ],
    };
    methods = {
      search() {
        wepy.navigateTo({
          url: '/pages/course/search',
        })
      },
      orderHandler() {
        const self = this
        wepy.showActionSheet({
          itemList: ["平均分逆序", "平均分顺序", "评价逆序", "评价顺序"],
          success: function(res) {
            self.orderIndex = res.tapIndex
            self.order = orders[res.tapIndex]
            self.page = 1;
            self.$apply()
            self.getCourses()
          }
        })
      },
      more() {
        this.page++
          this.getCourses()
      },
      submit(e) {
        this.page = 1
        this.params = e.detail.value;
        this.getCourses()
        this.isShowFilter = false
      },
      reset() {
        for (let i = 0; i < this.filters.length; i++) {
          for (let m = 0; m < this.filters[i].radios.length; m++) {
            this.filters[i].radios[m].checked = false
          }
        }
      },
      showFilter() {
        this.isShowFilter = !this.isShowFilter
      },
      checked(i, j) {
        for (let m = 0; m < this.filters[i].radios.length; m++) {
          if (m != j)
            this.filters[i].radios[m].checked = false
        }
        this.filters[i].radios[j].checked = !this.filters[i].radios[j].checked
      }
    };
    newCourse(courses) {
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        courses[i].call_name = callTypes[courses[i].call_name]
        courses[i].task = taskTypes[courses[i].task]
        courses[i].exam_type = examTypes[courses[i].exam_type]
        courses[i].avg_grade = courses[i].avg_grade.toFixed(1)
        courses[i].fail_rate = courses[i].fail_rate.toFixed(1)
        let teachers = courses[i].teacher.split(",")
        let is_more = teachers.length > 1 ? '等' : ''
        courses[i].teacher = teachers[0] + is_more
      }
      return courses
    }
    async getCourses() {
      if (this.page > 1 && this.isEmpty) {
        this.ShowToast("已经到底了！")
        return
      }
      const resp = await this.GetWithBind("/course/all", Object.assign({
        page: this.page,
        page_size: this.page_size,
        order: this.order,
      }, this.params))
      if (this.page > 1) {
        this.courses = this.courses.concat(this.newCourse(resp.data))
      } else {
        this.courses = this.newCourse(resp.data)
      }
      if (resp.data.length === 0) {
        this.isEmpty = true
      }
      this.$apply()
    }
    onLoad() {
      this.getCourses()
      this.height = wx.getSystemInfoSync().screenHeight - 25
    }
  }
</script>
