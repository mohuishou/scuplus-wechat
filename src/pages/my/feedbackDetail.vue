<style lang="less">
  @import "./src/less/config";
  page {
    background: @bg-color;
  }
  .title {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 20rpx;
    border-bottom: 2rpx solid #eee;
    .tag {
      padding: 4rpx;
      border: 2rpx solid #008e59;
      color: #008e59;
      border-radius: 6rpx;
      font-size: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      &.closed {
        border: 2rpx solid @base-color;
        color: @base-color;
      }
    }
  }
  .content {
    background: #fff;
    padding: 20rpx;
  }
  .comments {
    .comment {
      margin-top: 20rpx;
      background: #fff;
      padding: 20rpx;
      .username {
        text-align: right;
      }
    }
  }
  .new-comment {
    background: #fff;
    margin-top: 20rpx;
    padding: 20rpx;
    textarea {
      width: 100%;
      border-bottom: 3rpx solid #ddd;
    }
    .mview {
      width: 100%;
      height: 80rpx;
      margin-top: 25rpx;
      .btn {
        background: @base-color;
        color: #fff;
        width: 100%;
        border-radius: 10rpx;
        font-size: 28rpx;
      }
    }
  }
</style>

<template>
  <view>
    <view class="title">
      <view>{{issue.title}}</view>
      <view class="tag {{issue.state}}">{{issue.state == "closed" ? "已关闭" : "开放中"}}</view>
    </view>
    <view class="content">
      <htmlParser parserName="name" parserType="md" :parserContent.sync="content" />
    </view>
    <view class="comments">
      <repeat for="{{commentArr}}" index="i" key="{{i}}">
        <view class="comment">
          {{item}}
          <view wx:if="{{comments[i].nickName != ''}}" class="username">——{{comments[i].nickName}}</view>
        </view>
      </repeat>
    </view>
    <view wx:if="{{ id > 0 && issue.state == 'open' }}" class="new-comment">
      <textarea value="{{commentVal.val}}" @input="commentChange" name="content" placeholder="请输入内容" />
      <mview @mtap.user="newComment" :arg.sync="commentVal" class="mview">
        <view slot="content" class="btn">提交评论</view>
      </mview>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import htmlParser from "components/htmlParser";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import db from "util/db"
  import MView from 'components/mview'
  export default class FeedBackDetail extends wepy.page {
    config = {
      navigationBarTitleText: "反馈详情"
    };
    components = {
      htmlParser: htmlParser,
      mview: MView,
    };
    mixins = [HttpMixin, ToastMixin];
    computed = {
      content() {
        if ("body" in this.issue) {
          return this.issue.body.replace(/scuplus_version[\s\S]+/g, "")
        }
        return ""
      }
    };
    data = {
      issue: {},
      comments: [],
      commentArr: [],
      commentVal: {
        val: ""
      },
      id: 0
    };
    methods = {
      async newComment(e) {
        try {
          if (e.val == "") {
            this.ShowToast("不能为空！")
            return
          }
          let content = e.val + "   $$$" + db.Get("nickName")
          await this.POST("/user/feedback/comment/" + this.id, {
            content: content
          })
          await this.get()
          this.commentVal.val = ""
        } catch (error) {
          console.log(error);
        }
      },
      commentChange(e) {
        this.commentVal.val = e.detail.value
      }
    }
    watch = {
      comments(newVal, oldVal) {
        this.commentArr = []
        for (let i = 0; i < newVal.length; i++) {
          const e = newVal[i];
          if (e.user.login == "mohuishou") {
            newVal[i].nickName = "管理员"
          } else {
            const arr = e.body.split("$$$")
            newVal[i].nickName = arr[1] || ''
            newVal[i].body = arr[0]
            e.body = arr[0]
          }
          this.commentArr.push(e.body)
        }
        return newVal
      }
    }
    async get() {
      try {
        const resp = await this.GET("/user/feedback/" + this.id);
        wepy.setNavigationBarTitle({
          title: resp.data.issue.title
        });
        this.issue = resp.data.issue;
        this.comments = resp.data.comments;
        this.$apply()
        // this.$invoke("htmlParser", "htmlParserNotice");
        this.$broadcast("htmlParser-broadcast")
        // this.$invoke("htmlParser2", "htmlParserNotice");
      } catch (error) {
        console.log(error);
      }
    }
    async onLoad(option) {
      try {
        this.id = option.id
        this.get()
      } catch (error) {
        console.log(error);
      }
    }
  }
</script>
