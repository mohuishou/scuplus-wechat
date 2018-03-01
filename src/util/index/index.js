const funcs = [{
    name: '课程表',
    url: 'schedule',
    icon: 'kechengbiao',
    bg: '#eacdd1',
    type: 'login'
  },
  {
    name: '成绩',
    url: 'grade',
    icon: 'chengji',
    bg: '#99ccee',
    type: 'login'
  },
  {
    name: '反馈',
    url: 'feedback',
    icon: 'fankui',
    bg: '#569597',
    type: 'normal'
  },
  {
    name: '自习',
    url: 'classroom',
    icon: 'building',
    bg: '#90caaf',
    type: 'normal'
  },
  {
    name: '我的借阅',
    url: 'library/loan',
    icon: 'book',
    bg: '#ab96c5',
    type: 'login'
  }, {
    name: '历史借阅',
    url: 'library/loan?type=history',
    icon: 'book1',
    bg: '#eea5d1',
    type: 'login'
  },
  {
    name: '图书搜索',
    url: 'library/search',
    icon: 'search',
    bg: '#857e95',
    type: 'normal'
  }

]

module.exports = {
  funcs: funcs
}
