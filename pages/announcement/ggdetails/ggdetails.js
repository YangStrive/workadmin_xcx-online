// pages/announcement/ggdetails/ggdetails.js
var dmNetwork = require('../../../utils/network.js')
var dmUtil = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    istrue: false,
    details: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync("isRefresh", 1);
    var options = dmUtil.getQueryString()
    this.setData({ options: options })
    this.getGgdetail()
  },
  getGgdetail: function () {
    var data = this.data.options;
    dmNetwork.post(dmNetwork.getGgDetail, data, (res) => {
      var res = res.data;
      if (res.errno == 0) {
        res.data.create_at = dmUtil.formatTimeDate3(res.data.create_at)
        this.setData({
          details: res.data,
        })
      } else {
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
        })
      }
    })
  },
  onShowImg: function (ev) {
    dmUtil.previewImage([ev.currentTarget.dataset.imgvalue]);
  },
  onConfrim: function () {
    var data = this.data.options;
    data.status = 1;
    dmNetwork.post(dmNetwork.checkreport, data, (res) => {
      var res = res.data;
      if (res.errno == 0) {
        this.setData({ istrue: true })
        wx.showToast({ title: '操作成功', 'icon': 'success' })
      } else {
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
        })
      }
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})