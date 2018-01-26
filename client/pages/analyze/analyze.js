// pages/analyze/analyze.js

var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({
  data: {
    typeData: {
      "shangyi":0,
      "kuzi":0,
      "waitao":0,
      "xiezi":0,
      "qita":0
    },
    seasonData: {
      "chunqiu":0,
      "xia":0,
      "dong":0
    },
    colorData:{
      "hei":0,
      "bai":0,
      "hui":0,
      "hong":0,
      "zong":0,
      "cheng":0,
      "huang":0,
      "lv":0,
      "lan":0,
      "zi":0
    },
  },
  touchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
  },
  onLoad: function (e) {
    var that = this;
    var windowWidth = wx.getSystemInfoSync().windowWidth *0.8 ;
    wx.request({
      url: app.globalData.hosturl + 'analyze/getTypeData',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        if (res.data.code == 1) {
          var data = res.data.data[0]
          that.setData({
            typeData: data
          })
          console.log(that.data.typeData)
          pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas_type',
            type: 'pie',
            series: [{
              name: '上衣',
              data: parseInt(that.data.typeData['shangyi']),
            }, {
              name: '裤子',
              data: parseInt(that.data.typeData['kuzi']),
            }, {
              name: '外套',
              data: parseInt(that.data.typeData['waitao']),
            }, {
              name: '鞋子',
              data: parseInt(that.data.typeData['xiezi']),
            }, {
              name: '其他',
              data: parseInt(that.data.typeData['qita']),
            }
            ],
            width: windowWidth,
            height: 280,
            dataLabel: true,
          });
        }
        else {
          util.showModel('加载失败', res.data.error)
        }
      }
    })
    wx.request({
      url: app.globalData.hosturl + 'analyze/getSeasonData',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          var data = res.data.data[0]
          that.setData({
            seasonData: data
          })
          pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas_season',
            type: 'pie',
            series: [{
              name: '春秋',
              data: parseInt(that.data.seasonData['chunqiu']),
            }, {
              name: '夏季',
              data: parseInt(that.data.seasonData['xia']),
            }, {
              name: '冬季',
              data: parseInt(that.data.seasonData['dong']),
            }
            ],
            width: windowWidth,
            height: 280,
            dataLabel: true,
          });
          
        }
        else {
          util.showModel('加载失败', res.data.error)
        }
      }
    })
    wx.request({
      url: app.globalData.hosturl + 'analyze/getColorData',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        if (res.data.code == 1) {
          var data = res.data.data[0]
          that.setData({
            colorData: data
          })
          
          pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas_color',
            type: 'pie',
            series: [{
              name: '黑',
              data: parseInt(that.data.colorData['hei']),
            }, {
              name: '白',
              data: parseInt(that.data.colorData['bai']),
            }, {
              name: '灰',
              data: parseInt(that.data.colorData['hui']),
            }, {
              name: '红',
              data: parseInt(that.data.colorData['hong']),
            }, {
              name: '棕',
              data: parseInt(that.data.colorData['zong']),
            }, {
              name: '橙',
              data: parseInt(that.data.colorData['cheng']),
            }, {
              name: '黄',
              data: parseInt(that.data.colorData['huang']),
            }, {
              name: '绿',
              data: parseInt(that.data.colorData['lv']),
            }, {
              name: '蓝',
              data: parseInt(that.data.colorData['lan']),
            }, {
              name: '紫',
              data: parseInt(that.data.colorData['zi']),
            }
            ],
            width: windowWidth,
            height: 280,
            dataLabel: true,
          });
        }
        else {
          util.showModel('加载失败', res.data.error)
        }
      }
    })
    
  },
});