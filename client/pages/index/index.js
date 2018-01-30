//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    imgUrls: [
    
      {
        cid: 0,
        img: "../../images/3.jpg",
      },
    ],
    contentItems:['','','',''],
    motto: '我的衣橱',
    userInfo: {}
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
      var that = this;
      wx.request({
        url: app.globalData.hosturl + 'clothe/getMyLike',
        method: 'POST',
        data: {
          openid: app.globalData.userInfo.openId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 1 && res.data.length !=0) {
            var alldata = res.data.data
            that.setData({
              imgUrls: alldata
            })       
          }
          else{
            that.setData({
              imgUrls: [{
                cid: 0,
                img: "../../images/3.jpg",
                }]
            })
          }
        }
      })
    } else {
      wx.redirectTo({
        url: '../login/login'
      })
    }
  },
  onTouch:function(event){
    wx.navigateTo({
      url: '../all/all?currentTab=0&nowid=' + event.currentTarget.id,
    })
  },
   onTouchLike: function (event) {
    wx.navigateTo({
      url: '../all/all?currentTab=1&nowid=1'
    })
  },
   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
     wx.showNavigationBarLoading() //在标题栏中显示加载
     var that = this;
     wx.request({
       url: app.globalData.hosturl + 'clothe/getMyLike',
       method: 'POST',
       data: {
         openid: app.globalData.userInfo.openId
       },
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       success: function (res) {
         console.log(res)
         if (res.data.code == 1 && res.data.length != 0) {
           var alldata = res.data.data
           that.setData({
             imgUrls: alldata
           })
         }
         else {
           that.setData({
             imgUrls: [{
               cid: 0,
               img: "../../images/3.jpg",
             }]
           })
         }
         wx.hideNavigationBarLoading() //完成停止加载
         wx.stopPullDownRefresh() //停止下拉刷新
       }
     })
   }
})
