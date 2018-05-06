const funcs = [
  {
    name: '课程表',
    url: 'schedule',
    icon: 'schedule',
    bg: '#eacdd1',
    type: 'jwc'
  },
  {
    name: '成绩',
    url: 'grade',
    icon: 'grade',
    bg: '#99ccee',
    type: 'jwc'
  },
  {
    name: '自习',
    url: 'classroom',
    icon: 'classroom',
    bg: '#90caaf',
    type: 'normal'
  },
  {
    name: '我的借阅',
    url: 'library/loan',
    icon: 'loan',
    bg: '#ab96c5',
    type: 'library'
  },
  {
    name: '历史借阅',
    url: 'library/loan?type=history',
    icon: 'loan_all',
    bg: '#eea5d1',
    type: 'library'
  },
  {
    name: '图书搜索',
    url: 'library/search',
    icon: 'search',
    bg: '#857e95',
    type: 'normal'
  },
  {
    name: '一卡通',
    url: 'ecard',
    icon: 'card',
    bg: '#b92c18',
    type: 'my'
  },
  {
    name: '考表',
    url: 'exam',
    icon: 'exam',
    bg: '#2578b5',
    type: 'jwc'
  },
  {
    name: '校历',
    url: 'calendar',
    icon: 'cal',
    bg: '#008e59',
    type: 'normal'
  },
  {
    name: '校车',
    url: 'bus',
    icon: 'bus',
    bg: '#ab96c5',
    type: 'normal'
  }
]

module.exports = {
  funcs: funcs
}
