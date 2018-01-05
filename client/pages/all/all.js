// pages/index/all.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateItems: [
      {
        cate_id: 1,
        cate_name: "全部",
        ishaveChild: true,
        children: [
          {
            child_id: 1,
            name: '描述',
            image: "../../images/1.jpg"
          },
          {
            child_id: 2,
            name: '描述',
            image: "../../images/2.jpg"
          },
          {
            child_id: 3,
            name: '描述',
            image: "../../images/3.jpg"
          },
          {
            child_id: 4,
            name: '描述',
            image: "../../images/1.jpg"
          },
        ]
      },
      {
        cate_id: 2,
        cate_name: "上衣",
        ishaveChild: true,
        children: [
          {
            child_id: 1,
            name: '描述',
            image: "../../images/3.jpg"
          },
          {
            child_id: 2,
            name: '描述',
            image: "../../images/2.jpg"
          },
        ]
      },
      {
        cate_id: 3,
        cate_name: "裤子",
        ishaveChild: true,
        children: [
          {}, {},
        ]
      },
      {
        cate_id: 4,
        cate_name: "外套",
        ishaveChild: false,
        children: []
      }
    ],
    curNav: 1,
    curIndex:1
  },
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
  onTouchDetail: function (event) {
    wx.navigateTo({
      url: '../detail/detail',
    })
  }
})