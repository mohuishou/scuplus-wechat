<style lang="less">

</style>

<template>
  <view>
    
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import Card from "components/course/card"
  export default class CourseLists extends wepy.page {
    config = {};
    mixins = [HttpMixin, ToastMixin];
    components = {
      Card: Card,
    };
  }
</script>
