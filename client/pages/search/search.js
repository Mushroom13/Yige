//index.js
var WxSearch = require('../../wxSearchView/wxSearchView.js');

Page({
  data: {
    currentTab:0,
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
      ['上衣', '裤子', '外套', '鞋子', '其他', '春秋', '夏季', '冬季', '黑', '白', '灰', '红', '棕', '橙', '黄', '绿', '蓝', '紫'],// 搜索匹配，[]表示不使用
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
    console.log(value)
    // wx.redirectTo({
    //   url: '../index/index?searchValue='+value
    // })
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
