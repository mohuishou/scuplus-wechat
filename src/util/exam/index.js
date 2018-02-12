// 考表相关
// 获取/更新考表

import {GetB, PostB} from '../http'

async function get() {
  const resp = await GetB('/exam')
  if (resp.status === 0) {
    return resp.data
  } else {

  }
}

async function update() {
  const resp = await PostB("/exam")
  if (resp.status === 0){

  }else {

  }
}

export {
  get,
  update
}
