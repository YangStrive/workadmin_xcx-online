// pages/withdrawal/withdrawalstatus/withdrawalstatus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successimg: 'http://cdn.doumistatic.com/92,baf186f6eb8b3d.png',
    failimg: 'http://cdn.doumistatic.com/96,baf1935eb60ae3.png',
    errmsg: '',
    amount: '',
    account: '',
    status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('提现结果页面errmsg:' + options.errmsg);
    this.setData({ errmsg: options.errmsg, amount: options.amount, account: options.account, status: options.status == 1 ? true : false })
  },
  tapBtn: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({ balance: 0.00, page: 1 })
    prevPage.onLoad()
    wx.navigateBack()
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