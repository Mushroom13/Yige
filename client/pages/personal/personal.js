// pages/personal/personal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  // data: {

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ageindex: app.globalData.age,
      sexindex: app.globalData.sex
    })
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
  data: {
    array2: ['保密','男', '女',],
    objectArray2: [
      {
        id: 0,
        name: '保密'
      },
      {
        id: 1,
        name: '男'
      },
      {
        id: 2,
        name: '女'
      },
    ],
    sexindex: 0,

    array: ['0-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66-70', '71-75', '76-80', '80以上',],
    objectArray: [
      {
        id: 0,
        name: '0-5'
      },
      {
        id: 1,
        name: '6-10'
      },
      {
        id: 2,
        name: '11-15'
      },
      {
        id: 3,
        name: '16-20'
      },
      {
        id: 4,
        name: '21-25'
      },
      {
        id: 5,
        name: '26-30'
      },
      {
        id: 6,
        name: '31-35'
      },
      {
        id: 7,
        name: '36-40'
      },
      {
        id: 8,
        name: '41-45'
      },
      {
        id: 9,
        name: '46-50'
      },
      {
        id: 10,
        name: '51-55'
      },
      {
        id: 11,
        name: '56-60'
      },
      {
        id: 12,
        name: '61-65'
      },
      {
        id: 13,
        name: '66-70'
      },
      {
        id: 14,
        name: '71-75'
      },
      {
        id: 15,
        name: '76-80'
      },
      {
        id: 16,
        name: '80以上'
      },
    ],
    ageindex: 0,
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexindex: e.detail.value
    })
  },

  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ageindex: e.detail.value
    })
  },
})