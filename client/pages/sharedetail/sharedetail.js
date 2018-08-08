// pages/mymatchdel/mymatchdel.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sid: options.sid,
    })
    var that = this
    wx.request({
      url: app.globalData.hosturl + 'match/getMatchDetail',
      method: 'POST',
      data: {
        sid: that.data.sid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          console.log(res.data)
          var detail = res.data.data[0]
          var imgs = res.data.imgs
          that.setData({
            img: detail.img,
            imgs: imgs,
            weather: detail.weather,
            situation: detail.situation,
            detail: detail.detail
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  gohome: function () {
      wx.navigateTo({
        url: '../login/login',
      })
  },

})