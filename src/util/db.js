let prefix = "scuplus.dev."
if (process.env.NODE_ENV == "production") {
  prefix = "scuplus.production."
}

const Set = (key, value) => {
  wx.setStorageSync(prefix + key, value)
}

const Get = (key) => {
  return wx.getStorageSync(prefix + key)
}

module.exports = {
  Set,
  Get
}
