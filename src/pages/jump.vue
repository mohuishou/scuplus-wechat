<template>
  <view class="main">
    <view>We川大其实是我在大二就开始有的一个想法，之前有提到过，在学校的学习生活当中学校各个系统的使用让我觉得很不爽，使用起来很不方便，所以就想做一个简单快捷的应用，将所有我们会用到的系统都整合在一起，变成一个统一的系统，并且移动端友好，大部分操作我们完全不用打开电脑，这样就OK了。</view>
    <view>在大三的时候我做了一个叫scuplus的Web应用，这个应用应该没有人知道，这个应该是We川大小程序的雏形，其实功能也比较完善了，现在We川大有的功能上面大多都有，但是由于在测试的过程当中，交互，UI体验，程序运行效率都不理想，所以还没有发布我就直接推倒，没有发布了。</view>
    <view>再后来我从大三下学期的五月份开始实习找工作然后实习，实习结束已经是17年12月底了，这段时间正好没有事情，又想起了之前没有做完的这个应用，然后又想到了小程序，就想做一个小程序出来。其实这个时候做这个小程序对我来说用处不大了，功利一点说工作已经找到了，三方也签了，这时候再每天开发10几个小时做一个小程序，没有太多现实的好处。</view>
    <view>但是在一个生活了四年的川大，临走之前总想留下一点什么，就像是毕业了想给自己的四年交上一个大作业一样。就这样从立项开始，然后开发发布，前前后后三十多个版本，一个人，做了产品/交互/UI/前端/后端/运营，做出来了一个相对来说像是一个产品的产品，并且截止到目前一共23000多名用户，平均5000+日活，处理了300+反馈意见，高峰期页面访问量20W+，用户日活1w+。其实还是挺有成就感的。</view>

    <view>但是我从七月份毕业开始进入DJI工作，每天下班回来基本上已经没有时间再维护了，这个时候青创联的贺师兄找到我，经过讨论之后，We川大会转交给青创联，有专门的团队进行开发维护。由于注册了新的企业小程序川大圈校内通，所以需要重新绑定一下，点击下方按钮跳转新的小程序。</view>
    <view class="a" @tap="copy">
      We川大是一个Wepy开发的开源小程序,看到这儿了去Github点个Star吧，点我复制链接： https://github.com/mohuishou/scuplus-wechat
    </view>
    <view>
      感谢大家对We川大的喜爱与包容，GoodBye!
    </view>
  </view>
  <navigator class="mo-btn" target="miniProgram" open-type="navigate" app-id="wx4331bf135831624c" path="pages/index" extra-data="" version="release">
    点击跳转川大圈校内通
  </navigator>
</template>
<script>
import wepy from "wepy";
export default class NewsLists extends wepy.page {
  config = {
    navigationBarTitleText: "We川大 - GoodBye"
  };
  methods = {
    copy(){
      wx.setClipboardData({
        data: 'https://github.com/mohuishou/scuplus-wechat', //需要设置的内容,
        success: res => {}
      });
    }
  }
}
</script>

<style lang="less" scoped>
.a{
  color: blueviolet;
}
.mo-btn{
  position: fixed;
  bottom: 0;
}
.main {
  font-size: 15px;
  line-height: 200%;
  padding: 20px;
  margin-bottom: 20px;
  > view {
    text-indent: 2em;
    padding-bottom: 15px;
  }
}
</style>
