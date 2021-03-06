//index.js
var WxSearch = require('../../wxSearchView/wxSearchView.js');
const app = getApp()
Page({
  data: {
    currentTab:0,
    cateItems:null,
    isSearch:false
  },

  // 搜索栏
  onLoad: function (options) {
    this.setData({
      currentTab: options.currentTab,
    })
    var that = this;
    WxSearch.init(
      that,  // 本页面一个引用
      [], // 类型,
      ['上衣', '裤子', '外套', '鞋子','裙子', '其他', '春', '夏', '秋', '冬', '黑', '白', '灰', '红', '棕', '橙', '黄', '绿', '蓝', '紫'],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    // 跳转
    // wx.redirectTo({
    //   url: '../index/index?searchValue='+value
    // })
   
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'clothe/getResult',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId,
        currentTab: this.data.currentTab,
        value:value.value,
        keys: value.tipKeys
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          isSearch: true,
        })
        if (res.data.code == 1) {
          var alldata = res.data.data
          console.log(alldata)
          if(alldata.length>0)
          {
            that.setData({
              cateItems: alldata,
            })
          }
          else
          {
            that.setData({
              cateItems: null,
            })
          }
        }
      }
    });
  },

  // 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 跳转
    console.log('返回')
    wx.navigateBack({
      delta: 1
    })
  }

})
