// pages/provincelist/provincelist.js
var util = require('../../utils/util.js')
var dmNetwork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: true,
    showname: '',
    pid: '',
    cid: '',
    did: '',
    pname: '',
    cname: '',
    dname: '',
    provinceArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    dmNetwork.get(dmNetwork.invitePosition, { team_id: 0, project_id: 0 }, (res) => {
      if (res.data.errno == 0) {
        that.setData({
          provinceArr: res.data.data
        })
        wx.setStorage({
          key: 'localityData',
          data: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.errmsg
        })
      }
    }, (err) => {
      //网络异常处理
    })
  },
  //前往市列表
  gotoCityList: function (e) {
    console.log(JSON.stringify(e.currentTarget.dataset.itemdata.short_name))
    wx.navigateTo({
      url: '../citylist/citylist?province_id=' + e.currentTarget.dataset.itemdata.province_id + '&province_name=' + e.currentTarget.dataset.itemdata.short_name  ,
    })
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }
})