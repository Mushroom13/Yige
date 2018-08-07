// pages/addmatchpic.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upsuccess:false,
    focus: false,
    inputValue: '',
    imgUrl: null,
    OriimgUrl: "../../images/2.jpg",
    weather: 0,
    situation: '',
    detail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sid: options.sid,
    })
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
        util.showBusy('正在加载')
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
            if (res.code != 1) {
              util.showModel('加载失败', res.error)
            }
            else {
              util.showSuccess('图片加载完成')
              that.setData({
                imgUrl: res.data.imgUrl,
                OriimgUrl: null
              })
            }
          },

          fail: function (e) {
            console.log(e)
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
  bindButtonTap: function () {
    var that = this;
    util.showBusy('上传中')
    wx.request({
      url: app.globalData.hosturl + 'match/uploadPic',
      method: 'POST',
      data: {
        sid: that.data.sid,
        img: that.data.imgUrl,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        util.showSuccess('上传成功')
        that.setData({
          upsuccess:true
        })
      }
    })

  },
  bindButtonTap_cancle: function () {
    var that = this;
    that.setData({
      imgUrl: null,
      OriimgUrl: "../../images/2.jpg"
    })
  },

  getweather: function (e) {
    console.log(e.detail.value)
    this.setData({
      weather: e.detail.value
    })

  },
  getsituation: function (e) {
    console.log(e.detail.value)
    this.setData({
      situation: e.detail.value
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
    this.setData({
      detail: e.detail.value
    })
  },
  upload: function () {
    var that = this;
    util.showBusy('上传中')
    console.log(that.data)
    wx.request({
      url: app.globalData.hosturl + 'match/uploaddetail',
      method: 'POST',
      data: {
        sid: that.data.sid,
        weather: that.data.weather,
        situation: that.data.situation,
        detail: that.data.detail,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        util.showSuccess('上传成功')
        wx.redirectTo({
          url: '../mymatch/mymatch'
        })
      }
    })
  }
})