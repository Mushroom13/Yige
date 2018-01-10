//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('utils/util.js')

App({

  globalData: {
    userInfo: null,
    sex:0,
    age:0,
    hosturl: config.service.hostUrl
  },
  onLaunch: function () {
    
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })

    //设置会话服务Url
    qcloud.setLoginUrl(config.service.loginUrl)
    
  }
  
})