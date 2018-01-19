// pages/upload/upload.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
  //  */
  // data: {
  
  // },
  onTouch: function (event) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: '', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            //do something
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        //console.log(filePath)
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            res = JSON.parse(res.data)
            console.log(res)
            if (res.code==1)
            {
              util.showModel('上传失败', res.data)
            }
            else
            {
              util.showSuccess('图片加载完成')
              that.setData({
                imgUrl: res.data.imgUrl,
                OriimgUrl: null
              })
            }
          },

          fail: function (e) {
            util.showModel('图片加载失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  data: {
    focus: false,
    inputValue: '',
    imgUrl:null,
    OriimgUrl: "../../images/2.jpg"
  },
  bindButtonTap: function () {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'upload/addClothe',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId,
        url: that.data.imgUrl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        util.showSuccess('上传成功')
        var resArray = res.data.toString().split(":");
        if (resArray[0] == 'true') {
          that.setData({
            imgUrl: null,
            OriimgUrl: "../../images/2.jpg"
          })
          wx.navigateTo({
            url: '../clothe/clothe?cid=' + resArray[1]
          })
        }
        else {
          util.showModel('上传失败', resArray[1])
        }
      }
    })
    
  },
  bindButtonTap_cancle: function (){
    var that = this;
    that.setData({
      imgUrl: null,
      OriimgUrl: "../../images/2.jpg"
    })
  }
})
