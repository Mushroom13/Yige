// pages/analyze/analyze.js

var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
Page({
  data: {
  },
  touchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
  },
  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfo();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas_type',
      type: 'pie',
      series: [{
        name: '上衣',
        data: 15,
      }, {
        name: '裤子',
        data: 35,
      }, {
        name: '外套',
        data: 78,
      }, {
        name: '鞋子',
        data: 63,
      }, {
        name: '其他',
        data: 35,
      } 
      ],
      width: windowWidth,
      height: 280,
      dataLabel: true,
    });
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas_season',
      type: 'pie',
      series: [{
        name: '春秋',
        data: 15,
      }, {
        name: '夏季',
        data: 35,
      }, {
        name: '冬季',
        data: 78,
      }
      ],
      width: windowWidth,
      height: 280,
      dataLabel: true,
    });
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas_color',
      type: 'pie',
      series: [{
        name: '黑',
        data: 15,
      }, {
        name: '白',
        data: 35,
      }, {
        name: '灰',
        data: 78,
      }, {
        name: '红',
        data: 63,
      }, {
        name: '棕',
        data: 35,
      }, {
        name: '橙',
        data: 35,
      }, {
        name: '黄',
        data: 78,
      }, {
        name: '绿',
        data: 63,
      }, {
        name: '蓝',
        data: 35,
      }, {
        name: '紫',
        data: 35,
      }
      ],
      width: windowWidth,
      height: 280,
      dataLabel: true,
    });
  }
});