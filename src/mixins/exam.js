import wepy from 'wepy'

export default class ExamMixin extends wepy.mixin {
  async GetExam() {
    const resp = await this.GET('/user/exam')
    return resp.data
  }

  async UpdateExam() {
    try {
      await this.POST('/user/exam')
    } catch (error) {
      console.log(error)
    }
  }
}
