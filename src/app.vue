<style lang="less">
  @import "./icon/iconfont";
  @import "./less/config";
  @import "./less/app";
</style>

<script>
  import wepy from 'wepy'
  import 'wepy-async-function'
  import {
    POST
  } from './util/http'
  import db from './util/db'
  export default class extends wepy.app {
    config = {
      pages: [
        'pages/index',
        'pages/library/loan',
        'pages/library/search',
        'pages/newsLists',
        'pages/tagLists',
        'pages/classroom',
        'pages/schedule',
        'pages/grade',
        'pages/details',
        'pages/bind',
        'pages/ecard',
        'pages/exam',
        'pages/my/my',
        'pages/my/feedback',
        'pages/my/feedbackList',
        'pages/my/feedbackDetail',
        'pages/calendar',
        'pages/bus',
        'pages/addSchedule',
        'pages/chooseTags',
        'pages/course/lists',
        'pages/course/details',
        'pages/course/comment',
        'pages/course/commentLists',
        'pages/course/search',
        'pages/lostFind/lists',
        'pages/lostFind/item',
        'pages/lostFind/new',
        'pages/help',
        'pages/contact/lists',
        'pages/contact/detail',
        'pages/lecture/lecture',
        'pages/evaluate/lists',
      ],
      window: {
        navigationBarBackgroundColor: '#ffffff',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: 'We川大',
        backgroundColor: '#dddddd'
      },
      tabBar: {
        selectedColor: '#f06292',
        color: '#707070',
        list: [{
            pagePath: 'pages/index',
            text: '首页',
            iconPath: 'icon/home.png',
            selectedIconPath: 'icon/home@select.png'
          },
          {
            pagePath: 'pages/course/lists',
            text: '寻课',
            iconPath: 'icon/course.png',
            selectedIconPath: 'icon/course@select.png'
          },
          {
            pagePath: 'pages/newsLists',
            text: '资讯',
            iconPath: 'icon/news.png',
            selectedIconPath: 'icon/news@select.png'
          },
          {
            pagePath: 'pages/my/my',
            text: '个人中心',
            iconPath: 'icon/user.png',
            selectedIconPath: 'icon/user@select.png'
          }
        ]
      }
    };
    constructor() {
      super()
      this.use('requestfix')
    }
    GlobalData = {
      verify: 0
    }
    onLaunch() {
      this.getToken()
    }
    onShow() {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，请重启应用',
          showCancel: false,
          success: function(res) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        })
      })
      updateManager.onUpdateFailed(function() {
        // 新的版本下载失败
        console.log("新版本下载失败！");
      })
    }
    // 微信登录
    wxLogin() {
      return new Promise((resolve, reject) => {
        wepy.login({
          success: res => {
            if (res.code) {
              resolve(res.code)
            } else {
              reject(res.errMsg)
            }
          },
          fail: err => reject(err)
        })
      })
    }
    async login() {
      try {
        // 微信登录
        const code = await this.wxLogin()
        // 登录服务器
        const resp = await POST('/login', {
          code: code
        })
        if (resp.status === 0) {
          const data = resp.data
          db.Set('token', data.token)
          db.Set('verify', data.verify)
          db.Set('library_verify', data.library_verify)
          db.Set('jwc_verify', data.jwc_verify)
          this.GlobalData.verify = data.verify
          if (data.verify === 0) {
            wepy.navigateTo({
              url: 'bind'
            })
          }
        } else {
          throw '用户登录失败！'
        }
      } catch (err) {
        console.log('err', err)
      }
    }
    checkSession() {
      return new Promise((resolve, reject) => {
        wepy.checkSession({
          success: () => resolve(),
          fail: () => reject()
        })
      })
    }
    async getToken() {
      let token = db.Get('token')
      if (!token) {
        this.login()
      } else {
        try {
          await this.checkSession()
        } catch (error) {
          this.login()
        }
      }
    }
  }
</script>
