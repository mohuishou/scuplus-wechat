import wepy from 'wepy'

export default class ECardMixin extends wepy.mixin {
  async GetECard() {
    const resp = await this.GetWithBind('/user/ecard')
    return resp.data
  }

  async UpdateECard() {
    try {
      await this.PostWithBind('/user/ecard')
      return this.GetECard()
    } catch (error) {
      console.log(error)
    }
  }
}
