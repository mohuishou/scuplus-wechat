const funcs = [{
  name: '课程表',
  url: 'schedule',
  icon: 'schedule',
  bg: '#eacdd1',
  type: 'jwc',
  is_graduate: true
},
{
  name: '成绩',
  url: 'grade',
  icon: 'grade',
  bg: '#99ccee',
  type: 'jwc',
  is_graduate: true
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
  type: 'jwc',
  is_graduate: false
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
},
{
  name: '失物招领',
  url: 'lostFind/lists',
  icon: 'lost_find',
  bg: '#ab96c5',
  type: 'jwc',
  is_graduate: true
},
{
  name: '学术讲座',
  url: 'lecture/lecture',
  icon: 'lecture',
  bg: '#ab96c5',
  type: 'normal'
},
{
  name: '通讯录',
  url: 'contact/lists',
  icon: 'contact',
  bg: '#ab96c5',
  type: 'normal'
},
{
  name: '帮助',
  url: 'help',
  icon: 'help',
  bg: '#ab96c5',
  type: 'normal'
},
{
  name: '快捷评教',
  url: 'evaluate/lists',
  icon: 'eva',
  bg: '#ab96c5',
  type: 'jwc',
  is_graduate: false
},
{
  name: '课程评价',
  url: 'course/commentLists',
  icon: 'course_eva',
  bg: '#ab96c5',
  type: 'jwc',
  is_graduate: false
},
{
  name: '我的反馈',
  url: 'my/feedbackList',
  icon: 'feedback',
  bg: '#ab96c5',
  type: 'normal'
},
{
  name: '通知设置',
  url: 'my/notifyConfig',
  icon: 'notify',
  bg: '#ab96c5',
  type: 'normal'
},
{
  name: '研究生',
  url: 'my/userConfig',
  icon: 'gs',
  bg: '#ab96c5',
  type: 'normal'
},
{
  name: '打赏',
  url: 'money',
  icon: 'money',
  bg: '#ab96c5',
  type: 'money'
}
]

module.exports = {
  funcs: funcs
}
