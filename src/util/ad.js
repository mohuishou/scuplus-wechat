import db from './db'

let adConfig = [{
  key: 'courseList',
  name: '寻课列表',
  value: true,
  aid: 'adunit-df0fd6c5249c88d8'
},
{
  key: 'courseDetail',
  name: '课程详情',
  value: true,
  aid: 'adunit-980940e6a5b9ca5b'
},
{
  key: 'courseSearch',
  name: '课程搜索',
  value: true,
  aid: 'adunit-62acc878b4ddb2f5'
},
{
  key: 'newsLists',
  name: '资讯列表',
  value: true,
  aid: 'adunit-b7c8a72749643459'
},
{
  key: 'newsDetail',
  name: '资讯详情',
  value: true,
  aid: 'adunit-1a73b5ee3ee27c9e'
},
{
  key: 'classroom',
  name: '我要自习',
  value: true,
  aid: 'adunit-95d3bc7778042638'
},
{
  key: 'grade',
  name: '成绩',
  value: true,
  aid: 'adunit-d286588d6069ca38'
},
{
  key: 'evaluate',
  name: '快捷评教',
  value: true,
  aid: 'adunit-ed4290e57794aa57'
},
{
  key: 'index',
  name: '首页',
  value: true,
  aid: 'adunit-35df18bc957ebcd2'
}
]

module.exports = {
  Set(key, value) {
    let config = this.GetConfig()
    const i = this._getIndex(key)
    config[i].value = value
    db.Set('ad', config)
  },

  Get(key) {
    const config = this.GetConfig()
    const i = this._getIndex(key)
    return config[i].value
  },

  _getIndex(key) {
    const config = this.GetConfig()
    for (let i = 0; i < config.length; i++) {
      if (key == config[i].key) {
        return i
      }
    }
    return 0
  },

  GetConfig() {
    let config = db.Get('ad')
    if (config.length < adConfig.length) {
      config = adConfig
      db.Set('ad', adConfig)
    }
    return config
  }
}
