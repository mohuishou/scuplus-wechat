<style lang="less" scoped>
  .share-c {
    width: 100%;
    height: 100%;
    display: none;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    margin-top: -10rpx;
  }
  .share {
    display: none;
    position: fixed;
    top: 200rpx;
    left: calc(~"50% - 100px");
    canvas {
      border-radius: 10rpx;
    }
    button {
      margin-top: 10rpx;
    }
  }
</style>

<template>
  <view @touchstart="moveStart" @touchend="moveEnd" class="share-c" style="display: {{isShow ? 'block' : 'none'}} ;">
    <view class="share" style="display: {{isShow ? 'block' : 'none'}} ;">
      <canvas disable-scroll="true" style="width: 200px; height: 290px;" canvas-id="m"></canvas>
      <button type="warn" @tap="save">保存图片</button>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import htmlParser from "components/htmlParser";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db";
  import {
    domain
  } from 'config'
  export default class Share extends wepy.component {
    components = {};
    props = {
      option: Object
    }
    data = {
      isShow: false,
      x: 0
    }
    mixins = [HttpMixin, ToastMixin];
    methods = {
      moveStart(e) {
        this.x = e.touches[0].clientY
      },
      moveEnd(e) {
        let changedX = e.changedTouches[0].clientX - this.x
        if (Math.abs(changedX) > 80) this.isShow = false;
      },
      async save() {
        try {
          const path = await this.canvasToTmp("m")
          const res = await this.saveImage(path)
          console.log(res);
          this.ShowToast("图片保存成功，请到朋友圈分享", "success")
        } catch (err) {
          this.ShowToast("保存失败")
        }
        this.isShow = false;
        this.$apply()
      },
      async show() {
        if (this.isShow) return;
        this.isShow = true;
        this.$apply();
        wepy.showLoading && wepy.showLoading({
          title: '加载中...'
        })
        try {
          const title = this.option.title
          const from = this.option.from
          const content = "  " + this.option.content.trim()
          const params = this.option.params
          // 获取canvas对象
          const ctx = wx.createCanvasContext("m");
          // 绘制背景
          ctx.rect(0, 0, 250, 333)
          ctx.setFillStyle('#ffffff')
          ctx.fill()
          // 基础设置
          ctx.setFillStyle('#000000')
          let lineHeight = 15
          let y = 10;
          // 绘制标题
          ctx.setFontSize(12);
          for (let i = 0; i < title.length / 15 && i < 2; i++) {
            y += lineHeight;
            ctx.fillText(title.substr(i * 15, 15), 10, y);
          }
          // 绘制来源 标签
          ctx.setFontSize(10);
          if (from != "") {
            ctx.setFillStyle('#888888')
            y += 8
            y += lineHeight;
            ctx.fillText(from.substr(0, 15), 10, y);
          }
          // 绘制content
          ctx.setFillStyle('#000000')
          y += 8
          for (let i = 0; i < content.length / 18 && i < 7; i++) {
            y += lineHeight;
            ctx.fillText(content.substr(i * 18, 18), 10, y);
          }
          // 绘制左下角引导语
          ctx.setFontSize(12);
          y += lineHeight + 8
          ctx.fillText("长按识别We川大", 10, y + lineHeight * 2 + 5);
          ctx.fillText("查看完整内容", 10, y + lineHeight * 3 + 5);
          // 绘制右下角小程序码
          const path = await this.download("/wechat/qcode?" + params);
          console.log(path);
          ctx.drawImage(path, 110, y, 80, 80);
          ctx.draw();
        } catch (error) {
          console.log(error);
          this.ShowToast("绘制分享图片失败！")
          this.isShow = false;
          this.$apply();
        }
        wepy.hideLoading && wepy.hideLoading()
      }
    }
    saveImage(path) {
      return new Promise((resolve, reject) => {
        wepy.saveImageToPhotosAlbum({
          filePath: path,
          success: res => resolve(res),
          fail: res => reject(res)
        })
      })
    }
    canvasToTmp(canvasId) {
      return new Promise((resolve, reject) => {
        wepy.canvasToTempFilePath({
          canvasId: canvasId,
          success: res => resolve(res.tempFilePath),
          fail: res => reject(res)
        })
      })
    }
    download(url) {
      return new Promise((resolve, reject) => {
        wepy.downloadFile({
          url: domain + url, //仅为示例，并非真实的资源
          header: {
            'Authorization': 'Bearer ' + db.Get('token')
          },
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
