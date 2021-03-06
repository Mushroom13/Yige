// pages/index/all.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    clientHeight: 0,
    // tab切换  
    currentTab: 0,
    cateItems: [
      {
        cate_id: 1,
        cate_name: "全部",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 2,
        cate_name: "上衣",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 3,
        cate_name: "裤子",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 4,
        cate_name: "外套",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 5,
        cate_name: "裙子",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 6,
        cate_name: "鞋子",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 7,
        cate_name: "其他",
        ishaveChild: false,
        children: []
      }
    ],
    curNav: 1,
    curIndex: 0,
    likeItems: [
      {
        cate_id: 1,
        cate_name: "全部",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 2,
        cate_name: "上衣",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 3,
        cate_name: "裤子",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 4,
        cate_name: "外套",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 5,
        cate_name: "裙子",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 6,
        cate_name: "鞋子",
        ishaveChild: false,
        children: []
      },
      {
        cate_id: 7,
        cate_name: "其他",
        ishaveChild: false,
        children: []
      }
    ]
  },
  // 搜索入口  
  wxSearchTab: function () {
    var that=this
    wx.navigateTo({
      url: '../search/search?currentTab=' + that.data.currentTab
    })
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
    this.setData({
      currentTab: options.currentTab,
      curNav: options.nowid,
      curIndex: options.nowid - 1,
    })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'clothe/getAll',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          
          var alldata = res.data.data
          var jsonArray = new Array();
          var jsonCount = new Array();
          var likeArray = new Array();
          var likeCount = new Array();
          var cateItems = that.data.cateItems;
          var likeItems = that.data.likeItems;
          for (var i = 0; i < 7; i++) {
            cateItems[i].children = new Array();
            cateItems[i].ishaveChild = false;
            likeItems[i].children = new Array();
            likeItems[i].ishaveChild = false;
            jsonArray[i] = new Array();
            jsonCount[i] = 0;
            likeArray[i] = new Array();
            likeCount[i] = 0;
          }
          console.log(alldata) 
          for (var i in alldata) {
            var item = alldata[i]
            if (item.location == 0) {

              jsonCount[0]++;//全部项的总数加一
              var alljson = {
                child_id: jsonCount[0],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建全部项

              cateItems[0].children.push(alljson)//将全部项增加到全部数组中
              cateItems[0].ishaveChild = true;
              var itemtype = parseInt(item.clothetype) + 1;
              jsonCount[itemtype]++;//对应项的总数加一
              var ajson = {
                child_id: jsonCount[itemtype],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建某一项

              cateItems[itemtype].children.push(ajson)//将这一项增加到对应数组中
              cateItems[itemtype].ishaveChild = true;
            }
            else {
              likeCount[0]++;//全部项的总数加一
              var alljson = {
                child_id: jsonCount[0],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建全部项

              likeItems[0].children.push(alljson)//将全部项增加到全部数组中
              likeItems[0].ishaveChild = true;
              var itemtype = parseInt(item.clothetype) + 1;
              likeCount[itemtype]++;//对应项的总数加一
              var ajson = {
                child_id: likeCount[itemtype],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建某一项

              likeItems[itemtype].children.push(ajson)//将这一项增加到对应数组中
              likeItems[itemtype].ishaveChild = true;
            }

          }
          that.setData({
            cateItems: cateItems,
            likeItems: likeItems
          })
          wx.getSystemInfo({
            success: function (res) {
              that.setData({
                clientHeight: res.windowHeight
              });
            }
          });
        }
        else {
          util.showModel('加载失败', res.data.error)
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
      }
    })
  },
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'clothe/getAll',
      method: 'POST',
      data: {
        openid: app.globalData.userInfo.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var alldata = res.data.data
          console.log(alldata)
          var jsonArray = new Array();
          var jsonCount = new Array();
          var likeArray = new Array();
          var likeCount = new Array();
          var cateItems = that.data.cateItems;
          var likeItems = that.data.likeItems;
          for (var i = 0; i < 7; i++) {
            cateItems[i].children = new Array();
            cateItems[i].ishaveChild = false;
            likeItems[i].children = new Array();
            likeItems[i].ishaveChild = false;
            jsonArray[i] = new Array();
            jsonCount[i] = 0;
            likeArray[i] = new Array();
            likeCount[i] = 0;
          }

          for (var i in alldata) {
            var item = alldata[i]
            if (item.location == 0) {

              jsonCount[0]++;//全部项的总数加一
              var alljson = {
                child_id: jsonCount[0],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建全部项

              cateItems[0].children.push(alljson)//将全部项增加到全部数组中
              cateItems[0].ishaveChild = true;
              var itemtype = parseInt(item.clothetype) + 1;
              jsonCount[itemtype]++;//对应项的总数加一
              var ajson = {
                child_id: jsonCount[itemtype],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建某一项

              cateItems[itemtype].children.push(ajson)//将这一项增加到对应数组中
              cateItems[itemtype].ishaveChild = true;
            }
            else {

              likeCount[0]++;//全部项的总数加一
              var alljson = {
                child_id: jsonCount[0],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建全部项

              likeItems[0].children.push(alljson)//将全部项增加到全部数组中
              likeItems[0].ishaveChild = true;
              var itemtype = parseInt(item.clothetype) + 1;
              likeCount[itemtype]++;//对应项的总数加一
              var ajson = {
                child_id: likeCount[itemtype],
                name: item.clothedetail,
                image: item.clotheimg,
                cid: item.clotheid
              }//新建某一项

              likeItems[itemtype].children.push(ajson)//将这一项增加到对应数组中
              likeItems[itemtype].ishaveChild = true;
            }

          }
          that.setData({
            cateItems: cateItems,
            likeItems: likeItems
          })
          wx.getSystemInfo({
            success: function (res) {
              that.setData({
                clientHeight: res.windowHeight
              });
            }
          });
        }
        else {
          util.showModel('加载失败', res.data.error)
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })

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
  },
  
})