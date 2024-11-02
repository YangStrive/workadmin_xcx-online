// pages/bole/bo'le.js
var dmNetwork = require('../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_id: '',
    result: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.apply_id) {
      this.apply_id = options.apply_id
      this.getSalaryDetail(options.apply_id)
    }
  },

  backPrePage () {
    // wx.navigateBack({
    //   delta: 1
    // })
    wx.redirectTo({
      url: "/pages/withdrawal/mywallet/mywallet",
      success: (result) => { },
      fail: () => { },
      complete: () => { },
    });
  },

  getSalaryDetail (apply_id = '2') {
    dmNetwork.post(dmNetwork.getSalaryDetail, { apply_id }, (res) => {
      if (res.data.errno == '0') {
        this.setData({
          result: res.data.data
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.message,
          duration: 1500
        })
      }
    }, (err) => {

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

  }
})