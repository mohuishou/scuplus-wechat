import COS from './cos-wx-sdk-v5'
import {
  COSConf
} from '../config'
import dayjs from 'dayjs'

// 初始化实例
var cos = new COS(COSConf.key)

export function Upload(filepath, prefix = '') {
  let filename = prefix + dayjs().format('/YYYY/M/D/') + new Date().getTime() + '.' + filepath.substr(filepath.lastIndexOf('.') + 1)
  cos.postObject({
    Bucket: COSConf.bucket,
    Region: COSConf.region,
    Key: filename,
    FilePath: filepath,
    onProgress: function (info) {
      console.log(JSON.stringify(info))
    }
  }, function (err, data) {
    console.log(err || data)
  })
}
