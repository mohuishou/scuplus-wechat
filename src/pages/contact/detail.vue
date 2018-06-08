<style lang="less">
</style>
<template>
  <view></view>
</template>
<script>
import wepy from "wepy";
import HttpMixin from "mixins/http";
import ToastMixin from "mixins/toast";
export default class ContactDetail extends wepy.page {
  config = {};
  mixins = [HttpMixin, ToastMixin];
}
</script>
