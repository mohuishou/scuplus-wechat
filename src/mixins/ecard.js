import wepy from 'wepy'

export default class ECardMixin extends wepy.mixin {
  async GetECard() {
    const resp = await this.GET('/user/ecard', {
      page: 1,
      page_size: 15
    })
    return resp.data
  }

  async UpdateECard() {
    await this.POST('/user/ecard')
  }
}
