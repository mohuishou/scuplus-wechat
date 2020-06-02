<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
  }
  form {
    display: block;
    margin-top: 20rpx;
    .form-group {
      background: #fff; // padding: 0 40rpx;
      // width: calc(~"100% - 80rpx");
      margin-bottom: 20rpx;
      .group {
        width: calc(~"100% - 80rpx");
        display: flex;
        padding: 20rpx 40rpx;
        border-bottom: 2rpx solid #eee;
        align-items: baseline;
        &:last-child {
          border: none;
        }
        .title {
          width: 160rpx;
        }
        input,
        picker,
        checkbox-group {
          width: calc(~"100% - 160rpx");
        }
      }
    }
    button {
      position: fixed;
      bottom: 0;
      border-radius: 0;
      width: 100%;
      height: 100rpx;
      font-size: 28rpx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, @base-color, #ed5a65);
      color: #fff;
      font-size: 28rpx;
    }
  }
  checkbox-group {
    display: flex;
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    >label {
      margin-right: 20rpx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4rpx 20rpx;
      margin: 0rpx 20rpx 20rpx 0rpx;
      font-size: 28rpx;
      color: @base-color;
      border: 2rpx solid @base-color;
      &.checked {
        background: @base-color;
        color: #fff;
      }
    }
  }
  /*  重写 checkbox 样式  */
  checkbox .wx-checkbox-input {
    display: none;
  }
</style>

<template>
  <view>
    <form @submit="submit">
      <view class="form-group">
        <lable class="group">
          <view class="title">课程</view>
          <input name="course_name" placeholder="请输入课程名" />
        </lable>
        <lable class="group">
          <view class="title">教师</view>
          <input name="teacher" placeholder="请输入教师姓名" />
        </lable>
      </view>
      <view class="form-group">
        <lable class="group">
          <view class="title">校区</view>
          <picker @change="campusChange" name="campus" mode="selector" range="{{campusArr}}" value="{{campusIdx}}">
            {{campusArr[campusIdx]}}
          </picker>
        </lable>
        <lable class="group">
          <view class="title">教学楼</view>
          <input name="building" placeholder="请输入教学楼" />
        </lable>
        <lable class="group">
          <view class="title">教室</view>
          <input name="classroom" placeholder="请输入教室" />
        </lable>
      </view>
      <view class="form-group">
        <lable class="group">
          <view class="title">节次</view>
          <picker @change="sessionChange" name="session" mode="multiSelector" range="{{sessionArr}}" value="{{sessionIdx}}">
            {{sessionArr[0][sessionIdx[0]]}}-{{sessionArr[1][sessionIdx[1]]}}小节
          </picker>
        </lable>
        <lable class="group">
          <view class="title">星期</view>
          <picker @change="dayChange" name="day" mode="selector" range="{{dayArr}}" value="{{dayIdx}}">
            {{dayArr[dayIdx]}}
          </picker>
        </lable>
        <lable class="group">
          <view class="title">周次</view>
          <checkbox-group name="all_week">
            <label @tap="check({{index}})" wx:for="{{weekArr}}" wx:key="index" class="{{item.checked ?  'checked' : ''}}"><checkbox value="{{item.value}}" checked="{{item.checked}}"/>{{item.name}}</label>
          </checkbox-group>
        </lable>
      </view>
      <button form-type="submit">新增课程</button>
    </form>
  </view>
</template>

<script>
  import wepy from 'wepy'
import HttpMixin from 'mixins/http'
import ToastMixin from 'mixins/toast'
import db from 'util/db'
export default class AddSchedule extends wepy.page {
    config = {
      navigationBarTitleText: '自定义课程'
    };
    mixins = [HttpMixin, ToastMixin];
    methods = {
      check(i) {
        this.weekArr[i].checked = !this.weekArr[i].checked
      },
      submit(e) {
        let course = e.detail.value
        for (const x in course) {
          if (course[x] === '') {
            this.ShowToast('所有项目均为必填项！')
            return
          }
        }
        if (course.session[0] >= course.session[1]) {
          this.ShowToast('节次范围错误')
          return
        }
        course.day = course.day - 0 + 1
        // 节次
        let session = ''
        for (let i = course.session[0] - 0 + 1; i < course.session[1] - 0 + 1; i++) {
          session += i + ','
        }
        session += `${course.session[1] - 0 + 1}`
        course.session = session
        if (course.all_week.length === 0) {
          this.ShowToast('请选择上课周次！')
          return
        }
        course.all_week.sort((a, b) => a - b)
        course.all_week = course.all_week.join(',')
        course.course_id = -Math.random()
        course.lesson_id = -Math.random()
        // 添加课程
        let items = db.Get('myScheduleItems') || []
        items.push(course)
        db.Set('myScheduleItems', items)
        wepy.navigateBack({
          delta: 2 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
        })
      },
      campusChange(e) {
        this.campusIdx = e.detail.value
      },
      dayChange(e) {
        this.dayIdx = e.detail.value
      },
      sessionChange(e) {
        if (e.detail.value[0] >= e.detail.value[1]) {
          this.ShowToast('范围错误')
          this.sessionIdx = [0, 2]
          return
        }
        this.sessionIdx = e.detail.value
      }
    }
    data = {
      campusArr: ['江安', '望江', '华西'],
      campusIdx: 0,
      sessionArr: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      ],
      sessionIdx: [0, 2],
      dayArr: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      dayIdx: 0,
      weekArr: [{
        name: 1,
        value: 1,
        checked: false
      },
      {
        name: 2,
        value: 2,
        checked: false
      },
      {
        name: 3,
        value: 3,
        checked: false
      },
      {
        name: 4,
        value: 4,
        checked: false
      },
      {
        name: 5,
        value: 5,
        checked: false
      },
      {
        name: 6,
        value: 6,
        checked: false
      },
      {
        name: 7,
        value: 7,
        checked: false
      },
      {
        name: 8,
        value: 8,
        checked: false
      },
      {
        name: 9,
        value: 9,
        checked: false
      },
      {
        name: 10,
        value: 10,
        checked: false
      },
      {
        name: 11,
        value: 11,
        checked: false
      },
      {
        name: 12,
        value: 12,
        checked: false
      },
      {
        name: 13,
        value: 13,
        checked: false
      },
      {
        name: 14,
        value: 14,
        checked: false
      },
      {
        name: 15,
        value: 15,
        checked: false
      },
      {
        name: 16,
        value: 16,
        checked: false
      },
      {
        name: 17,
        value: 17,
        checked: false
      },
      {
        name: 18,
        value: 18,
        checked: false
      },
      {
        name: 19,
        value: 19,
        checked: false
      },
      {
        name: 20,
        value: 20,
        checked: false
      }
      ]
    }
  }
</script>
