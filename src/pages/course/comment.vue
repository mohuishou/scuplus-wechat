<style lang="less">
@import "./src/less/config";
page {
  // background: @bg-color;
  font-size: 28rpx;
}
radio-group {
  margin: 20rpx;
  margin-bottom: 30rpx;
  display: flex;
  align-items: baseline;
  .title {
    margin-right: 20rpx;
  }
  .radios {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    > label {
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
textarea {
  width: calc(~"100% - 85rpx");
  margin: 20rpx;
  border: 2rpx solid @base-color;
  padding: 20rpx;
  border-radius: 6rpx;
  height: 200rpx;
}
button {
  position: fixed;
  bottom: 0;
  border-radius: 0;
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, @base-color, #ed5a65);
  color: #fff;
  font-size: 28rpx;
}
.header {
  color: #000;
  font-size: 30rpx;
  margin: 20rpx;
  margin-bottom: 30rpx;
  text-align: center;
}
.tips {
  line-height: 150%;
  color: #888;
  margin: 20rpx;
  font-size: 26rpx;
}
</style>

<template>
  <view>
    <view class="header">
      {{course_name || eva_params.course_name + '-' + eva_params.teacher_name}}
    </view>
    <form @submit="submit">
      <block wx:for="{{items}}" wx:key="{{index}}">
        <radio-group name="{{item.name}}" class="radio-group">
          <view class="title">
            {{item.title}}
          </view>
          <view class="radios">
            <block wx:for="{{item.radios}}" wx:key="i" wx:for-index="i" wx:for-item="data">
              <label @tap="checked({{index}},{{i}})" class="{{data.checked ? 'checked' : ''}}">
                <radio value="{{data.value}}" checked="{{data.checked}}" />{{data.name}}</label>
            </block>
          </view>
        </radio-group>
      </block>
      <textarea name="comment" value="{{comment}}" placeholder="请输入课程评价"></textarea>
      <button wx:if="{{!(from == 'evaluate' && eva_params.status == 1)}}" form-type="submit">
        提交课程评价
      </button>
    </form>
    <view wx:if="{{from == 'evaluate'}}" class="tips">
      将您的评价分数很好(5)\一般(4)\糟糕(3)，以及课程评价内容提交到教务处,点名/考核/作业选项不会提交到教务处。系统将您的评价会匿名展示在课程的详细信息下，请客观理性的评价。
    </view>
    <view wx:else class="tips">
      您的评价将会匿名展示在课程的详细信息下，请客观理性的评价。
    </view>
  </view>
</template>

<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import db from "util/db";
import DataMixin from "mixins/data";
import TermMixin from "mixins/term";
export default class CourseLists extends wepy.page {
  config = {
    navigationBarTitleText: "课程评价"
  };
  mixins = [HttpMixin, ToastMixin];
  data = {
    params: {},
    comment: "",
    items: [
      {
        name: "call_name",
        title: "点名",
        radios: [
          {
            name: "全点",
            value: 4,
            checked: false
          },
          {
            name: "抽点",
            value: 3,
            checked: false
          },
          {
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
        title: "考核",
        radios: [
          {
            name: "论文",
            value: 1,
            checked: false
          },
          {
            name: "考试",
            value: 2,
            checked: false
          },
          {
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
        title: "作业",
        radios: [
          {
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
        name: "star",
        title: "评价",
        radios: [
          {
            name: "很好",
            value: 3,
            checked: false
          },
          {
            name: "一般",
            value: 2,
            checked: false
          },
          {
            name: "糟糕",
            value: 1,
            checked: false
          }
        ]
      }
    ],
    course_name: "",
    eva_params: {},
    from: "course"
  };
  methods = {
    checked(i, j) {
      for (let m = 0; m < this.items[i].radios.length; m++) {
        if (m != j) this.items[i].radios[m].checked = false;
      }
      this.items[i].radios[j].checked = !this.items[i].radios[j].checked;
    },
    async submit(e) {
      if (this.from == "evaluate") {
        if (this.status === 1) return;
        this.submitEvaluate(e);
      } else {
        this.submitCourse(e);
      }
    }
  };
  async submitEvaluate(e) {
    let params = e.detail.value;
    params.id = this.eva_params.id;
    for (const x in params) {
      if (!params[x]) {
        this.ShowToast("所有项目均为必填！");
        return;
      }
    }

    try {
      await this.POST("/evaluate", params);
      this.ShowToast("评价成功！");
      setTimeout(() => {
        wepy.navigateBack({
          delta: "1"
        });
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }
  async submitCourse(e) {
    let params = Object.assign(this.params, e.detail.value);
    const self = this;

    for (const x in params) {
      if (!params[x]) {
        self.ShowToast("所有项目均为必填！");
        return;
      }
    }
    try {
      let url = "/course/comment";
      const resp = await self.POST(url, params);
      self.ShowToast("评价成功！");
      setTimeout(() => {
        wepy.navigateBack({
          delta: "1"
        });
      }, 1000);
    } catch (error) {}
  }

  async initCourse(option) {
    this.params.id = option.id;
    // 有id表示需要修改
    if ("id" in option && option.id > 0) {
      const resp = await this.GET("/course/comment?id=" + option.id);
      this.course_name = resp.data.course_name;
      for (let i = 0; i < this.items.length; i++) {
        const v = resp.data[this.items[i].name];
        for (let j = 0; j < this.items[i].radios.length; j++) {
          this.items[i].radios[j].checked = false;
          if (v == this.items[i].radios[j].value)
            this.items[i].radios[j].checked = true;
        }
      }
      this.comment = resp.data.comment;
      this.$apply();
    }
  }
  async initEva(option) {
    try {
      this.from = option.from;
      const res = await this.GET("/evaluate/" + option.id);
      let eva = res.data.evaluate;
      let course_eva = res.data.course_evaluate;

      this.eva_params = eva;
      if (eva.status) {
        course_eva.star = eva.star - 2 < 1 ? 1 : eva.star - 2;
      }

      for (let i = 0; i < this.items.length; i++) {
        const v = course_eva[this.items[i].name];
        for (let j = 0; j < this.items[i].radios.length; j++) {
          this.items[i].radios[j].checked = false;
          if (v == this.items[i].radios[j].value)
            this.items[i].radios[j].checked = true;
        }
      }
      this.comment = eva.comment;
      this.$apply();
    } catch (error) {
      this.ShowToast("参数错误！");
      return;
    }
  }
  onLoad(option) {
    if ("from" in option && option.from === "evaluate") {
      this.initEva(option);
    } else {
      this.initCourse(option);
    }
  }
}
</script>