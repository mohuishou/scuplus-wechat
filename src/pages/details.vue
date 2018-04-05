<style lang="less">
  @import "./src/less/config";
  page {
    width: 100%;
    height: 100%;
    background: @bg-color;
  }
  .header {
    margin-bottom: 20rpx;
  }
  .details {
    margin: 0.2rem;
    padding: 0.5rem;
    margin-bottom: 120rpx;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 0.1rem;
  }
  .wxParse-tr {
    height: auto !important;
    border-bottom: 1px dashed #ccc !important;
    align-items: flex-start !important;
    .wxParse-td,
    .wxParse-th {
      border: none !important;
      height: auto !important;
    }
  }
  .wxParse-img {
    margin: 0 auto;
    width: 100%;
    display: block;
    background-color: transparent;
  }
  .content.news {
    view {
      line-height: 150% !important;
      font-size: 1rem !important;
    }
    .wxParse-img {
      margin: 0 auto;
      width: 100%;
      display: block;
      min-height: 400rpx;
      background-color: transparent;
    }
  }
  .footer {
    margin-top: 2rem;
    font-size: 24rpx;
    color: #888;
  }
  button.tab {
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
    line-height: normal;
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
  .tabs {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    line-height: normal;
    width: 100%;
    height: 90rpx;
    margin: 0;
    background: #fff;
    .tab {
      line-height: normal;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: @base-color;
      border: none;
      flex: 1;
      background: #fff;
      border: none;
      border-radius: 0;
      width: 100%;
      .iconfont {
        font-size: 38rpx;
      }
      .tab-name {
        font-size: 24rpx;
      }
    }
  }
</style>

<template>
  <share :option.sync="shareOption">
  </share>
  <view class="details">
    <view class="header">
      <view class="title">
        <text>{{title}}</text>
      </view>
      <view class="info">
      </view>
    </view>
    <view class="content {{from}}">
      <htmlParser :parserName="name" :parserContent.sync="content" />
    </view>
    <view wx:if="{{url}}" class="footer">
      <view @tap="copy({{url}})">
        原文(点击复制链接)：{{url}}
      </view>
    </view>
  </view>
  <view class="tabs">
    <button open-type="share" class="tab">
              <view class="iconfont icon-fenxiang"></view>
              <view class="tab-name">转发</view>
            </button>
    <view @tap="share" class="tab">
      <view class="iconfont icon-pengyouquan"></view>
      <view class="tab-name">分享</view>
    </view>
    <view @tap="copy({{url}})" class="tab">
      <view class="iconfont icon-lianjie"></view>
      <view class="tab-name">原文</view>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import htmlParser from "components/htmlParser";
  import Share from "components/share";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  export default class Details extends wepy.page {
    config = {};
    mixins = [HttpMixin, ToastMixin];
    components = {
      htmlParser: htmlParser,
      share: Share
    };
    data = {
      title: "",
      content: "",
      name: "123",
      url: "",
      from: "news",
      shareOption: {
        title: "",
        content: "",
        from: "",
        params: ""
      }
    };
    copyUrl(url) {
      const self = this;
      wepy.setClipboardData({
        data: url,
        success: function(res) {
          self.ShowToast("链接复制成功！");
        },
        fail: res => {
          self.ShowToast("链接复制失败！");
        }
      });
    }
    methods = {
      copy(url) {
        this.copyUrl(url);
      },
      wxParseTagATap(e) {
        this.copyUrl(e.currentTarget.dataset.src);
      },
      share() {
        this.$invoke("share", "show");
      }
    };
    async getDetail(id) {
      const resp = await this.GET(`/detail/${id}`);
      let title = resp.data.title;
      if (resp.data.category === "scuinfo") {
        title = resp.data.author;
        resp.data.content = resp.data.content.replace(/\n/g, "<br />");
      }
      this.content = resp.data.content;
      wepy.setNavigationBarTitle({
        title: title
      });
      this.title = title;
      this.url = resp.data.url;
      this.shareOption.title = title;
      this.shareOption.content = resp.data.content.replace(/<[^>]*>|\s+/g, "");
      this.shareOption.from = resp.data.category;
      this.shareOption.params =
        "page=pages/details&scene=" + resp.data.id + "_news";
      this.$apply();
      this.$invoke("htmlParser", "htmlParserNotice");
    }
    async getNotice(id) {
      const resp = await this.GET(`/notice/${id}`);
      this.content = resp.data.content;
      wepy.setNavigationBarTitle({
        title: resp.data.title
      });
      this.shareOption.title = resp.data.title;
      this.shareOption.content = resp.data.content.replace(/<[^>]*>|\s+/g, "");
      this.shareOption.params =
        "page=pages/details&scene=" + resp.data.id + "_notice";
      this.$apply();
      this.$invoke("htmlParser", "htmlParserNotice");
    }
    async onLoad(option) {
      this.from = option.from;
      let id = option.id || "";
      let from = option.from || "";
      if ("scene" in option) {
        const r = option.scene.split("_");
        id = r[0];
        from = r[1];
      }
      switch (from) {
        case "notice":
          await this.getNotice(id);
          break;
        default:
          await this.getDetail(id);
          break;
      }
    }
    onShareAppMessage(options) {
      return {
        title: this.title
      };
    }
  }
</script>

