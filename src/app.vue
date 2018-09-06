<style lang="less">
@import "./icon/iconfont";
@import "./less/config";
@import "./less/app";
</style>

<script>
import wepy from "wepy";
import "wepy-async-function";
import Http from "./util/http";
import db from "./util/db";
import Login from "./util/login"
export default class extends wepy.app {
  config = {
    pages: [
      "pages/jump",
      "pages/index",
      "pages/library/loan",
      "pages/library/search",
      "pages/newsLists",
      "pages/tagLists",
      "pages/classroom",
      "pages/schedule",
      "pages/grade",
      "pages/details",
      "pages/bind",
      "pages/ecard",
      "pages/exam",
      "pages/my/my",
      "pages/my/feedback",
      "pages/my/feedbackList",
      "pages/my/feedbackDetail",
      "pages/calendar",
      "pages/bus",
      "pages/addSchedule",
      "pages/chooseTags",
      "pages/course/lists",
      "pages/course/details",
      "pages/course/comment",
      "pages/course/commentLists",
      "pages/course/search",
      "pages/lostFind/lists",
      "pages/lostFind/item",
      "pages/lostFind/new",
      "pages/help",
      "pages/contact/lists",
      "pages/contact/detail",
      "pages/lecture/lecture",
      "pages/evaluate/lists",
      "pages/my/notifyConfig",
      "pages/my/adConfig",
      "pages/my/userConfig",
      "pages/share/schedule"
    ],
    window: {
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTextStyle: "black",
      navigationBarTitleText: "We川大",
      backgroundColor: "#dddddd"
    },
    // tabBar: {
    //   selectedColor: "#f06292",
    //   color: "#707070",
    //   list: [
    //     {
    //       pagePath: "pages/index",
    //       text: "首页",
    //       iconPath: "icon/home.png",
    //       selectedIconPath: "icon/home@select.png"
    //     },
    //     {
    //       pagePath: "pages/course/lists",
    //       text: "寻课",
    //       iconPath: "icon/course.png",
    //       selectedIconPath: "icon/course@select.png"
    //     },
    //     {
    //       pagePath: "pages/newsLists",
    //       text: "资讯",
    //       iconPath: "icon/news.png",
    //       selectedIconPath: "icon/news@select.png"
    //     },
    //     {
    //       pagePath: "pages/my/my",
    //       text: "个人中心",
    //       iconPath: "icon/user.png",
    //       selectedIconPath: "icon/user@select.png"
    //     }
    //   ]
    // }
  };
  constructor() {
    super();
    this.use("requestfix");
  }
  GlobalData = {
    verify: 0
  };
  onLaunch() {
    // 登录
    new Login().getToken()

    // 检查更新
    this.checkUpdate();

    // 检查通知信息
    this.checkNotice();
  }
  /**
   * 检查最新通过，如果有最新通知则弹窗提示
   */
  async checkNotice() {
    try {
      // 检查这条通知是否已经展示
      const newst_id = db.Get("notice_new") || 0;
      const res = await Http.Get("/notice/new", {}, false);
      if (!res.data.abstract) return;
      if (res.data.id === newst_id) {
        console.log("通知已阅", newst_id);
        return;
      }
      wepy.showModal({
        title: "通知", //提示的标题,
        content: res.data.abstract, //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#000000", //取消按钮的文字颜色,
        confirmText: "查看", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: function(r) {
          if (r.confirm) {
            wepy.navigateTo({
              url: `/pages/details?id=${res.data.id}&&from=notice`
            });
          }
          db.Set("notice_new", res.data.id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  checkUpdate() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，请重启应用",
        showCancel: false,
        success: function(res) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      });
    });
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      console.log("新版本下载失败！");
    });
  }
}
</script>
