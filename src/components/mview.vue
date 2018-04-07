<style lang="less">
  .okokok {
    display: block;
    button {
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
      view {
        // width: 100%;
        height: 100%;
      }
    }
  }
</style>

<template>
  <form @submit="cache" class="okokok" report-submit>
    <button formType="submit">
      <slot name="content"></slot>
    </button>
  </form>
</template>

<script>
  import wepy from 'wepy'
  import HttpMixin from 'mixins/http'
  export default class MView extends wepy.component {
    props = {
      args: {
        type: Array,
        default: []
      },
      arg: {
        type: Object,
      }
    }
    mixins = [HttpMixin]
    methods = {
      cache(e) {
        if (this.arg) {
          this.$emit("mtap", this.arg)
        } else {
          this.$emit("mtap", ...this.args)
        }
        if (e.detail.formId == "the formId is a mock one") {
          console.log("现在处于微信开发者工具！");
          return
        }
        this.POST("/user/msg_id", {
          "ids": e.detail.formId
        }, false)
      }
    }
  }
</script>
