// pages/addetails/addetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('参数' + JSON.stringify(options.team_id) + JSON.stringify(options.project_id) + JSON.stringify(options.notice_id))
    this.setData({
      path: "https://saas-test.doumi.com/h5/xcx_addetails.html?team_id=" + options.team_id + '&project_id=' + options.project_id + " & notice_id=" + options.notice_id
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