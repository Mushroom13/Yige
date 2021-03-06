// pages/upload/upload.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
  //  */
  data: {
    linktemp: '',
    linkinput:'',
    focus: false,
    inputValue: '',
    imgUrl: null,
    OriimgUrl: "../../images/2.jpg"
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
        wx.showNavigationBarLoading()
        var filePath = res.tempFilePaths[0]
        //console.log(filePath)
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            wx.hideNavigationBarLoading() //完成停止加载
            res = JSON.parse(res.data)
            console.log(res)
            if (res.code!=1)
            {
              
              util.showModel('加载失败', 'error')
            }
            else
            {
              that.setData({
                imgUrl: res.data.imgUrl,
                OriimgUrl: null
              })
            }
          },

          fail: function (e) {
            console.log(e)
            wx.hideNavigationBarLoading() //完成停止加载
            util.showModel('图片加载失败','error')
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

  bindButtonTap: function () {
    var that = this;
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.hosturl + 'clothe/addClothe',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId,
        url: that.data.imgUrl,
        title:'暂无描述'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        console.log(res)
        res = res.data
        if (res.result != 1) {
          util.showModel('加载失败', 'error')
        }
        else {
          wx.request({
            url: app.globalData.hosturl + 'clothe/getRecommend',
            method: 'POST',
            data: {
              clotheid: res.cid,
              filepath: res.filepath
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
            }
          })
          that.setData({
            imgUrl: null,
            OriimgUrl: "../../images/2.jpg"
          })
          wx.navigateTo({
            url: '../clothe/clothe?cid=' + res.cid
          })
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
  },
  bindUploadLinkButtonTap:function(){
    var link = this.data.linktemp;
    if (link!='')
    {
      var that = this;
      wx.showNavigationBarLoading()
      wx.request({
        url: app.globalData.hosturl + 'upload/uploadLink',
        method: 'POST',
        data: {
          clotheUrl: link,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading()
          res = res.data
          console.log(res)
          if (res.code != 1) {
            util.showModel('网页读取失败', 'error')
          }
          else {
            wx.showNavigationBarLoading()
            wx.request({
              url: app.globalData.hosturl + 'clothe/addClothe',
              method: 'POST',
              data: {
                openid: app.globalData.userInfo.openId,
                url: res.data.imgUrl,
                title: res.data.title
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                wx.hideNavigationBarLoading()
                res = res.data
                console.log(res)
                if (res.result != 1) {
                  util.showModel('加载失败','')
                }
                else {
                  wx.request({
                    url: app.globalData.hosturl + 'clothe/getRecommend',
                    method: 'POST',
                    data: {
                      clotheid: res.cid,
                      filepath: res.filepath
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                    }
                  })
                  that.setData({
                    linktemp: '',
                    linkinput: ''
                  })
                  wx.navigateTo({
                    url: '../clothe/clothe?cid=' + res.cid
                  })
                }
              }
            })
          }
        },
        fail: function (e) {
          wx.hideNavigationBarLoading()
          util.showModel('网页读取失败', '网页可能不存在')
        }
      })
    }
  },
  bindCancelLinkButtonTap:function(){
    this.setData({
      linktemp: '',
      linkinput:''
    })
  },
  linkChange: function (e) {
    this.setData({
      linktemp: e.detail.value
    })
  },
})
