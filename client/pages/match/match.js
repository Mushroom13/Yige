// pages/match/match.js

var util = require('../../utils/util.js')
var config = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"",
    groups: [
      [
        {
          cid: '0',
          img: '../../images/6.jpg'
        },
      ],
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.picurl + "/pic/" + options.ri + "/all.jpg",
    })
    var that=this
    wx.request({
      url: app.globalData.hosturl + 'clothe/recommendDetail',
      method: 'POST',
      data: {
        ri: options.ri,
        rj: options.rj,
        rk: options.rk,
        openid: app.globalData.userInfo.openId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          var data = res.data.data
          var recommends = res.data.recommends
          var groupsTemp=[]
          for (var i in recommends) {
            var pins=recommends[i]
            var pinArray=[]
            for(var j in pins) {
              var pin=pins[j]
              var pinJson={
                'cid': pin.cid,
                'img': pin.img
              }
              pinArray.push(pinJson)
            }
            groupsTemp.push(pinArray)            
          }
          console.log(groupsTemp)
          that.setData({
            groups: groupsTemp,

          })

        }
        // else {
        //   util.showModel('加载失败', res.data.error)
          
        // }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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