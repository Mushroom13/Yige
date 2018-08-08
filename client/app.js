//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('utils/util.js')

App({

  globalData: {
    userInfo: null,
    hosturl: config.service.hostUrl,
    picurl: config.service.host
  },
  onLaunch: function () {
    
   

    //设置会话服务Url
    qcloud.setLoginUrl(config.service.loginUrl)
    
  }
  
})