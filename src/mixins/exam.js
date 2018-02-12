import wepy from 'wepy'

export default class ExamMixin extends wepy.mixin {
  async GetExam() {
    const resp = await this.GetWithBind('/user/exam')
    console.log(resp)
    if (resp.status === 0) {
      return resp.data
    } else {

    }
  }
}
