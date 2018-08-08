// pages/mymatch/mymatch.js
const app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        cid: 0,
        img: "../../images/5.jpg",
      },
    ],
    cateItems: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: app.globalData.hosturl + 'match/getMatch',
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.openId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          var alldata = res.data.data
          console.log(alldata)
          if (alldata.length > 0) {
            that.setData({
              cateItems: alldata,
            })
          }
          else {
            that.setData({
              cateItems: null,
            })
          }
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  onTouchAdd:function(event){
    wx.redirectTo({
      url: '../addmatch/addmatch?currentTab=0&nowid=' + event.currentTarget.id ,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})