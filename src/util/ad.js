import db from './db'

let adConfig = [{
  key: 'courseList',
  name: '寻课列表',
  value: true
},
{
  key: 'courseDetail',
  name: '课程详情',
  value: true
},
{
  key: 'courseSearch',
  name: '课程搜索',
  value: true
},
{
  key: 'newsLists',
  name: '资讯列表',
  value: true
},
{
  key: 'newsDetail',
  name: '资讯详情',
  value: true
},
{
  key: 'classroom',
  name: '我要自习',
  value: true
},
{
  key: 'grade',
  name: '成绩',
  value: true
},
{
  key: 'evaluate',
  name: '快捷评教',
  value: true
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
    if (config.length == 0) {
      config = adConfig
      db.Set('ad', adConfig)
    }
    return config
  }
}
