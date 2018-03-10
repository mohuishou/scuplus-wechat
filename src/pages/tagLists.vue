<template>
  <list :isTag.sync="isTag" :params.sync="params">
  </list>
</template>

<script>
  import wepy from "wepy";
  import list from "../components/list"
  export default class TagLists extends wepy.page {
    config = {}
    components = {
      list: list,
    }
    data = {
      name: "",
      params: {
        tag_id: 1
      },
      isTag: ""
    }
    onLoad(option) {
      this.params.tag_id = option.id
      this.name = option.name
      this.isTag = "true"
      wepy.setNavigationBarTitle({
        title: "#" + option.name
      })
    }
    onShareAppMessage(options) {
      return {
        title: "#"+this.name
      }
    }
  }
</script>

<style lang="less">

</style>
