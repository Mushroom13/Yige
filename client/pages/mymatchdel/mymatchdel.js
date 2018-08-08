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
  onLoad: function(options) {
    this.setData({
      sid: options.sid,
    })
    var that=this
    wx.request({
      url: app.globalData.hosturl + 'match/getMatchDetail',
      method: 'POST',
      data: {
        sid:that.data.sid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          console.log(res.data)
          var detail = res.data.data[0]
          var imgs =res.data.imgs
          that.setData({
            img:detail.img,
            imgs:imgs,
            weather: detail.weather,
            situation: detail.situation,
            detail: detail.detail
          })
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  deleteMatch: function() {
    var that=this
    wx.request({
      url: app.globalData.hosturl + 'match/deleteMatch',
      method: 'POST',
      data: {
        sid: that.data.sid,
        uid: app.globalData.userInfo.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var resArray = res.data.toString().split(":");
        if (resArray[0] == 'true') {
          wx.switchTab({
            url: '../me/me',
          })
        }
        else {
          util.showModel('删除失败', resArray[1])
        }
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    if (options.from == 'button') {
      var that = this
      var shareObj = {
        title: "一个衣橱-搭配分享",
        path: '/pages/sharedetail/sharedetail?sid=' + this.data.sid,
        imageUrl: that.data.img,
        success: function(res) {　　　　　　 // 转发成功之后的回调

          if (res.errMsg == 'shareAppMessage:ok') {
            util.showSuccess("分享成功")
          }
        },
      };　　
      console.log(shareObj)

      return shareObj;
    }
  }
})