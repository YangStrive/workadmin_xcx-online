// pages/overtime/wagelist/wagelist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wageList: [1, 2, 3, 4, 5, 6],
    startTime: 0,
    endTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindTouchStart: function (e) {
    this.data.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.data.endTime = e.timeStamp;
  },
  deleteWageSetting: function (e) {
    wx.showModal({
      title: '提示',
      content: '删除工资设置？',
    })
  },
  editWageSetting: function (e) {
    if (this.data.endTime - this.data.startTime < 350) {
      wx.navigateTo({
        url: '../setting/setting',
      })
    }
  },
  addNewWageSetting:function(e){
    wx.navigateTo({
      url: '../setting/setting',
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