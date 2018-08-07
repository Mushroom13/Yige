// pages/share/share.js
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
  },
  // 上传图片接口
  doUpload: function() {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        util.showBusy('正在加载')
        var filePath = res.tempFilePaths[0]
        //console.log(filePath)
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function(res) {
            res = JSON.parse(res.data)
            console.log(res)
            if (res.code != 1) {
              util.showModel('加载失败', res.error)
            } else {
              that.setData({
                imgUrl: res.data.imgUrl,
                OriimgUrl: null
              })
              wx.request({
                url: app.globalData.hosturl + 'share/addShare',
                method: 'POST',
                data: {
                  uid: app.globalData.userInfo.openId,
                  img: that.data.imgUrl,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  util.showSuccess('图片加载完成')
                  that.setData({
                    sid: parseInt(res.data),
                  })
                }
              })
        

            }
          },

          fail: function(e) {
            console.log(e)
            util.showModel('图片加载失败')
          }
        })

      },
      fail: function(e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function() {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },
  onShareAppMessage: function(options) {
var that=this
    var shareObj = {
      title: "一个衣橱-搭配分享", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/sharedetail/sharedetail?sid=' + this.data.sid, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: that.data.imgUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {　　　　　　 // 转发成功之后的回调

        if (res.errMsg == 'shareAppMessage:ok') {
          util.showSuccess("分享成功")
          that.setData({
            upsuccess:true,

          })
        }
      },
      fail: function () { // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') { 　}
        else if (res.errMsg == 'shareAppMessage:fail') {　　　　　　　　 // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () { }
    };　　 // 来自页面内的按钮的转发
    console.log(shareObj)
    if (options.from == 'button') {
      return shareObj;
    }
  },
  bindButtonTap_cancle: function() {
    var that = this;
    that.setData({
      imgUrl: null,
      OriimgUrl: "../../images/2.jpg"
    })
  },
})