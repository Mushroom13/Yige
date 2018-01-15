// pages/clothe/clothe.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    halfSrc: '../../images/half.png',
    key: 0,//评分
    imgUrl:'',
    clothetype:'',
    clothedetail:'',
    locationarray: ['我的衣橱', '我的收藏',],
    objectLocationArray: [
      {
        id: 0,
        name: '我的衣橱'
      },
      {
        id: 1,
        name: '我的收藏'
      },
    ],
    locationindex: 0,

    typearray: ['上衣', '裤子', '外套', '鞋子', '其他'],
    objectTypeArray: [
      {
        id: 0,
        name: '上衣'
      },
      {
        id: 1,
        name: '裤子'
      },
      {
        id: 2,
        name: '外套'
      },
      {
        id: 3,
        name: '鞋子'
      },
      {
        id: 4,
        name: '其他'
      },
    ],
    clothetype: 0,

    seasonarray: ['春秋', '夏季','冬季'],
    objectSeasonArray: [
      {
        id: 0,
        name: '春秋'
      },
      {
        id: 1,
        name: '夏季'
      },
      {
        id: 2,
        name: '冬季'
      },
    ],
    seasonindex: 0,

    colorarray: ['黑', '白', '灰', '红', '棕', '橙', '黄', '绿', '蓝', '紫'],
    objectColorArray: [
      {
        id: 0,
        name: '黑'
      },
      {
        id: 1,
        name: '白'
      },
      {
        id: 2,
        name: '灰'
      },
      {
        id: 3,
        name: '红'
      },
      {
        id: 4,
        name: '棕'
      },
      {
        id: 5,
        name: '橙'
      },
      {
        id: 6,
        name: '黄'
      },
      {
        id: 7,
        name: '绿'
      },
      {
        id: 8,
        name: '蓝'
      },
      {
        id: 9,
        name: '紫'
      },
    ],
    colorindex: 0,
  },
  bindPickerChange_location: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      locationindex: e.detail.value
    })
  },
  bindPickerChange_season: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      seasonindex: e.detail.value
    })
  },
  bindPickerChange_color: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      colorindex: e.detail.value
    })
  },
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0
      key = 0;
    }
    console.log(key)
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log(key)
    this.setData({
      key: key
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   curNav: options.cid,
    // })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'upload/clotheDetail',
      method: 'POST',
      data: {
        clotheid: options.cid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code==1)
        {
          var data=res.data.data
          that.setData({
            imgUrl: data.clotheimg,
            clothetype:data.clothetype,
            clothedetail:data.clothedetail,
            locationindex:data.location,
            seasonindex:data.clotheseason,
            colorindex:data.clothecolor,
            key:data.clothestar,
          })
        }
        else
        {
          util.showModel('加载失败', res.data.error)
        }
      }
    })
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

  /**
     * 弹窗
     */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }
})