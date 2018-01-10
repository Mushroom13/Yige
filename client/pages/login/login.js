// pages/login/login.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({

  data: {
    logged: false
  },
  onLoad: function () {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，调用后台接口直接获取用户信息并跳转
          util.showBusy('正在登录')
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              console.log(result.data.data)
              app.globalData.userInfo = result.data.data
              app.globalData.sex = result.data.sex
              app.globalData.age = result.data.age
              that.setData({
                logged: true
              })
              wx.switchTab({
                url: '../index/index'
              })
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
        else{
          this.login()
        }
      }
    })
  },
  // 用户登录示例
  login: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
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

})