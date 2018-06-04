import COS from './cos-wx-sdk-v5'
import {
  COSConf
} from '../config'
import dayjs from 'dayjs'
import {
  GET
} from './http'

// 初始化实例
var cos = new COS(COSConf.key)

/**
 * 图片检查，调用小程序接口
 * @param {string} filepath 图片路径
 */
export async function ImageCheck(filepath) {
  const res = await GET('/wechat/token')
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://api.weixin.qq.com/wxa/img_sec_check?access_token=' + res.data,
      filePath: filepath,
      name: 'media',
      success: resp => {
        const data = JSON.parse(resp.data)
        if (data === 0) {
          resolve(true)
        } else if (data === 87014) {
          reject('图片包含违法违规内容')
        } else {
          resolve(data)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export function Upload(filepath, prefix = '') {
  let filename = prefix + dayjs().format('/YYYY/M/D/') + new Date().getTime() + '.' + filepath.substr(filepath.lastIndexOf('.') + 1)

  return new Promise((resolve, reject) => {
    cos.postObject({
      Bucket: COSConf.bucket,
      Region: COSConf.region,
      Key: filename,
      FilePath: filepath,
      onProgress: function (info) {
        console.log(JSON.stringify(info))
      }
    }, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
