<template>
  <import src="/plugins/wxParse/wxParse.wxml" />
  <block wx:for="{{htmlParserTpl.nodes}}" wx:key="{{index}}">
    <template is="wxParse0" data="{{item}}" />
  </block>
</template>

<script>
  import wepy from 'wepy'
  import WxParse from '../plugins/wxParse/wxParse'
  export default class HTMLParser extends wepy.component {
    props = {
      parserName: {
        type: String,
        default: 'htmlParserName'
      },
      parserContent: {
        type: String,
        default: '<p style=\'font-size: 32rpx; padding: 30rpx 0; text-align: center;\'>没有任何内容</p>'
      },
      parserType: {
        type: String,
        default: 'html'
      },
      parserPadding: {
        type: Number,
        default: 0
      }
    }
    data = {
      htmlParserTpl: {},
      bindData: {}
    }
    events = {
      'htmlParser-broadcast': ($event, ...args) => {
        this.htmlParse()
      },
    }
    methods = {
      htmlParserNotice() {
        this.htmlParse()
      }
    }
    async onLoad() {
      this.htmlParse()
    };
    wxParseImgLoad(image) {
      let imgInfo = image.detail
    };
    htmlParse() {
      /**
       * WxParse.wxParse(bindName , type, data, target,imagePadding)
       * 1.bindName绑定的数据名(必填)
       * 2.type可以为html或者md(必填)
       * 3.data为传入的具体数据(必填)
       * 4.target为Page对象,一般为this(必填)
       * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
       */
      try {
        let htmlContent = WxParse.wxParse(this.parserName, this.parserType, this.parserContent || this.props.parserContent.default, this, this.parserPadding)
        //        this.htmlParserTpl = this[this.parserName];
        this.htmlParserTpl = htmlContent[this.parserName]
        this.$apply()
      } catch (e) {
        console.warn('kinerHtmlParser:', '没有任何内容需要转换', e)
      }
    }
    wxParseImgTap(e) {
      WxParse.wxParseImgTap(e, this.bindData)
    }
  }
</script>

<style lang="less">
  @import "../plugins/wxParse/wxParse.wxss";
</style>