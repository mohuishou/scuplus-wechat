import wepy from 'wepy'

export default class ExamMixin extends wepy.mixin {
  async GetExam() {
    const resp = await this.GetWithBind('/user/exam')
    return resp.data
  }

  async UpdateExam() {
    try {
      await this.PostWithBind('/user/exam')
      return this.GetExam()
    } catch (error) {
      console.log(error)
    }
  }
}
