// pages/index/me.js
const app = getApp()

Page({
  data: {
    motto: '我的衣橱',
    userInfo: {},
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      wx.redirectTo({
        url: '../login/login'
      })
    }
  },
  onTouchLike: function (event) {
    wx.navigateTo({
      url: '../analyze/analyze',
    })
  },

  onTouchMatch: function(event) {
    wx.navigateTo({
      url: '../mymatch/mymatch',
    })
  },
 onTouchTips: function (event) {
   wx.navigateTo({
     url: '../tips/tips',
   })
 },
 onTouchShare: function (event) {
    wx.navigateTo({
      url: '../bbs/bbs',
    })
  }
})
