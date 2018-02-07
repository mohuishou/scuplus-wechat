import wepy from 'wepy';
import globalData from "./globalData"



export default class RequestMixin extends wepy.mixin {
  request = (url, params, method) => {
    console.log( globalData.GetData("token"));
    
    wepy.request({
      url: url,
      method: method,
      data: params,
      header: {
        "Authorization": "Bearer " + globalData.GetData("token")
      },
    })
  }
  Post(url, params) {
    this.request(url,params,"POST")
  }
}
