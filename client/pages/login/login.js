// pages/login/login.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({

  data: {
    logged: false
  },
  onLoad: function (options) {
    util.showBusy('正在加载')
    var that = this;
    qcloud.login({
      success(result) {
        // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
        qcloud.request({
          url: config.service.requestUrl,
          login: true,
          success(result) {
            util.showSuccess('登录成功')
            app.globalData.userInfo = result.data.data
            app.globalData.sex = result.data.sex
            app.globalData.age = result.data.age
            that.setData({
              logged: true
            })
            console.log(result)
            wx.switchTab({
              url: '../index/index'
            })
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        })
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
  //   wx.login({
  //     success: function (loginResult) {
  //       console.log(loginResult)
  //       var loginParams = {
  //         code: loginResult.code,
  //         encryptedData: options.encryptedData,
  //         iv: options.iv,
  //       }
  //       qcloud.requestLogin({
  //         loginParams, success(result) {
  //           util.showSuccess('登录成功')
  //           app.globalData.userInfo = options.userInfo
  //           app.globalData.sex = 1
  //           app.globalData.age = 1
  //           wx.switchTab({
  //             url: '../index/index'
  //           })
  //         },
  //         fail(error) {
  //           util.showModel('登录失败', error)
  //           console.log('登录失败', error)
  //         }
  //       });
  //     },
  //     fail: function (loginError) {
  //       util.showModel('登录失败', loginError)
  //       console.log('登录失败', loginError)
  //     },
  //   });
  // },
  

})