<style lang="less">
@import "./src/less/config";
page {
  padding-bottom: 80rpx;
}
canvas {
  width: 100%;
  height: 1100px;
}
.op {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  background: @base-color;
  .item {
    text-align: center;
    flex: 1;
  }
}
.info {
  font-size: 28rpx;
  color: #888;
  margin: 20rpx;
}
</style>
<template>
  <view>
    <view class="info" wx:if="{{isShow == 1}}">
      没有获取到用户课程信息，或者你的学期暂未设置，请返回课程表设置
    </view>
    <view wx:if="{{isShow == 2}}">
      <view class="info">没有获取到用户名，获取课程表图片，需要获取用户名</view>
      <button open-type="getUserInfo" @getuserinfo="getInfo" class="mo-btn">点击获取</button>
    </view>
    <block wx:if="{{isShow == 0}}">
      <canvas canvas-id="m"></canvas>
      <cover-view class="mo-btn op">
        <cover-view @tap="save" class="item">保存图片</cover-view>
        <!-- <cover-view @tap="changeBg" class="item">背景设置</cover-view> -->
      </cover-view>
    </block>

  </view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
import db from "util/db";

const width = 375;
const height = 1100;
// 每个块的大小
const rc_height = 70;
let rc_width = 50;
// 第一列大小
const firstColWidth = 25;
// header color
let header = {
  size: rc_width / 2 - 10,
  height: 50,
  bg: "#f5f5f5",
  color: "#555",
  line_color: "#d0d0d0"
};
// title set
const titleStyle = {
  size: 20,
  height: 50,
  color: "#000",
  bg: "#f5f5f5"
};
const days = ["日", "一", "二", "三", "四", "五", "六"];
const fontStyle = {
  color: "#fff",
  size: 10,
  top: 5
};
let ctx;

export default class Exam extends wepy.page {
  config = {
    navigationBarTitleText: "分享课程表"
  };
  mixins = [HttpMixin, ToastMixin];

  data = {
    width: 375,
    startY: 0,
    rc_width: 50,
    user_name: null,
    courses: null,
    year_term: null,
    isShow: 1,
    title: ""
  };
  show() {
    if (!this.courses || !this.year_term) {
      wepy.showModal({
        title: "提示", //提示的标题,
        content: "用户没有课程信息，或者没有设置学期信息。", //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: "返回", //确定按钮的文字，默认为取消，最多 4 个字符,
        success: res => {
          wepy.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }
      });
      return 1;
    }
    if (!this.user_name) return 2;
    return 0;
  }
  methods = {
    changeBg() {
      const self = this;
      wepy.chooseImage({
        count: "1", //最多可以选择的图片张数,
        success: res => {
          let path = res.tempFilePaths[0] || "";
          if (path != "") {
            self.startY = 0;
            self.$apply();
            self.drawBgImg(ctx, path);
            ctx.setGlobalAlpha(0.7);
            self.drawSchedule(ctx);
          }
        }, //返回图片的本地文件路径列表 tempFilePaths,
        fail: () => {},
        complete: () => {}
      });
    },
    async save() {
      try {
        const path = await this.canvasToTmp("m");
        const res = await this.saveImage(path);
        console.log(res);
        this.ShowToast("图片保存成功，请到朋友圈分享", "success");
      } catch (err) {
        this.ShowToast("保存失败");
      }
    },
    getInfo(e) {
      if ("userInfo" in e.detail) {
        this.user_name = e.detail.userInfo.nickName;
        this.isShow = 0;
        this.user_name = this.user_name.substr(0, 7);
        this.title = `${this.user_name}${this.year_term.year}年${
          this.year_term.term ? "春" : "秋"
        }季学期课表`;
        this.drawBg(ctx);
        this.drawSchedule(ctx);
      } else {
        this.ShowToast("用户名获取失败！");
      }
    }
  };
  onLoad() {
    try {
      let res = wx.getSystemInfoSync();
      this.width = res.windowWidth;
      rc_width = (this.width - 25) / 7;
      header.size = rc_width / 2 - 10;
    } catch (e) {
      // do something when get system info failed
    }

    // 获取课程信息
    this.courses = this.initCourse();
    // 获取年级学期设置
    this.year_term = db.Get("year_term") || null;
    this.isShow = this.show();

    // 获取canvas对象
    ctx = wx.createCanvasContext("m");
  }
  saveImage(path) {
    return new Promise((resolve, reject) => {
      wepy.saveImageToPhotosAlbum({
        filePath: path,
        success: res => resolve(res),
        fail: res => reject(res)
      });
    });
  }
  canvasToTmp(canvasId) {
    return new Promise((resolve, reject) => {
      wepy.canvasToTempFilePath({
        canvasId: canvasId,
        success: res => resolve(res.tempFilePath),
        fail: res => reject(res)
      });
    });
  }
  drawBg(ctx, bg = "") {
    // 绘制背景
    ctx.rect(0, 0, this.width, height);
    ctx.setFillStyle("#f8f8f5");
    ctx.fill();
  }
  drawBgImg(ctx, path) {
    ctx.drawImage(path, 0, 0, this.width, height);
  }
  async drawSchedule(ctx) {
    // 绘制标题
    ctx.setFillStyle(header.bg);
    ctx.fillRect(0, 0, this.width, titleStyle.height);
    ctx.beginPath();
    ctx.moveTo(0, titleStyle.height);
    ctx.lineTo(this.width, titleStyle.height);
    ctx.setStrokeStyle(header.line_color);
    ctx.stroke();
    ctx.closePath();

    this.drawText(
      ctx,
      this.title,
      (this.width - rc_width) / 2,
      this.startY,
      20,
      titleStyle
    );
    this.startY += titleStyle.height;
    // 绘制第一行
    this.drawHeader(ctx);
    this.startY += header.height;
    // 第一列
    this.drawFirstCol(ctx);

    // 获得课程,绘制课程
    this.courses.forEach(course => {
      this.drawCourse(ctx, course);
    });
    ctx.setFillStyle(header.color);
    ctx.setTextAlign("left");
    ctx.setFontSize(15);
    ctx.fillText("长按识别小程序", firstColWidth + 5, height - 40);
    ctx.fillText("微信搜索We川大查看", firstColWidth + 5, height - 20);
    const path = await this.download(
      "http://scuplus-1251451068.coscd.myqcloud.com/qcode.jpg"
    );
    ctx.drawImage(path, this.width - 70, height - 70, 60, 60);
    ctx.draw();
  }
  initCourse() {
    let colors = [
      "#f07c82",
      "#66CC99",
      "#ea7293",
      "#13afc8",
      "#FF9999",
      "#99CCFF",
      "#f97d1c",
      "#FF6666",
      "#21a265"
    ];
    // 获取课程
    let myScheduleItems = db.Get("myScheduleItems") || [];
    let scheduleItems = db.Get("scheduleItems") || [];
    scheduleItems = scheduleItems.concat(myScheduleItems);
    // 数据格式化
    for (let i = 0; i < scheduleItems.length; i++) {
      let e = scheduleItems[i];
      scheduleItems[i].sessionArr = e.session.split(",") || [];
      if (!("address" in e)) {
        scheduleItems[i].address = e.campus + e.building + e.classroom;
      }
      scheduleItems[i].bg_color = colors[i % colors.length];
    }
    // 返回
    return scheduleItems;
  }
  drawHeader(ctx) {
    ctx.setFillStyle(header.bg);
    ctx.fillRect(0, this.startY, this.width, header.height);
    ctx.setStrokeStyle(header.line_color);
    ctx.setLineWidth(1);
    ctx.setTextAlign("center");
    ctx.setFillStyle(header.color);
    ctx.setFontSize(header.size);
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(firstColWidth + i * rc_width, this.startY);
      ctx.lineTo(firstColWidth + i * rc_width, this.startY + header.height);
      ctx.stroke();
      ctx.closePath();
      ctx.fillText(
        "周" + days[i],
        50 + i * rc_width,
        this.startY + (header.height + header.size) / 2
      );
    }
  }
  drawFirstCol(ctx) {
    ctx.setFillStyle(header.bg);
    ctx.fillRect(0, this.startY, firstColWidth, height);
    ctx.setStrokeStyle(header.line_color);
    ctx.setLineWidth(1);
    ctx.setTextAlign("center");
    ctx.setFillStyle(header.color);
    ctx.setFontSize(header.size);
    for (let i = 0; i <= 13; i++) {
      ctx.beginPath();
      ctx.moveTo(0, rc_height * i + this.startY);
      ctx.lineTo(firstColWidth, rc_height * i + this.startY);
      ctx.stroke();
      ctx.closePath();
      if (i == 13) continue;
      ctx.fillText(
        i + 1,
        firstColWidth / 2,
        rc_height * (i + 0.5) + this.startY + header.size / 2
      );
    }
  }
  drawCourse(ctx, course) {
    // 定位
    let x = firstColWidth + (course.day % 7) * rc_width;
    let y = (course.sessionArr[0] - 1) * rc_height + this.startY;
    ctx.setFillStyle(course.bg_color);
    // 绘制背景
    ctx.fillRect(x, y, rc_width, rc_height * course.sessionArr.length);
    // 绘制文字
    y = y + fontStyle.top;
    y = this.drawText(ctx, course.course_name, x, y);
    this.drawText(ctx, "@" + course.address, x, y);
  }
  drawText(ctx, str, x, y, len = 4, style = fontStyle) {
    str = str.trim();
    ctx.setFillStyle(style.color);
    ctx.setTextAlign("center");
    ctx.setFontSize(style.size);
    for (let i = 0; i < str.length / len; i++) {
      y = y + style.size * 1.5;
      ctx.fillText(
        str.substr(i * len, len),
        x + rc_width / 2,
        y
        // rc_width,
      );
    }
    // y -= fontStyle.size * 1;
    return y;
  }
  download(url) {
    return new Promise((resolve, reject) => {
      wepy.downloadFile({
        url: url,
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            reject(res);
          }
        },
        fail: res => reject(res)
      });
    });
  }
}
</script>
