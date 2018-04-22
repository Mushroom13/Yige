// pages/weather/weather.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    low: '',
    high: '',
    season:'',
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
    this.setData({
      curlow: options.ilow,   
      curhigh:options.ihigh,
    })
    var that = this;
   if(that.data.curhigh-2>=23){
      that.setData({
        season:'夏装',
      })
    } 
   else if (that.data.curhigh-2 >= 18 && that.data.curhigh-2<23) {
      that.setData({
        season: '春秋装',
      })
    }
   else if (that.data.curhigh-2 >=15  && that.data.curhigh-2 < 18) {
     that.setData({
       season: '春秋装+薄外套',
     })
   }
   else if (that.data.curhigh-2 >= 13 && that.data.curhigh-2 < 15) {
     that.setData({
       season: '冬装',
     })
   }
   else if (that.data.curhigh-2 <13 ) {
     that.setData({
       season: '冬装+外套',
     })
   }
    that.setData({
      low: that.data.curlow,
      high: that.data.curhigh,
    }) 

    wx.request({
      url: app.globalData.hosturl + 'clothe/getSeasonClothe',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId,
        season: this.data.season,    
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