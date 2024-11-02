Page({

  /**
   * 页面的初始数据
   */
  data: {
    path:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      path: "https://m.doumi.com/wallet?domain_source=saas"
     // path: "https://saas-test.doumi.com/h5/jc_invite.html?code=Wm5OR3hJWG9qZXhNUWVJZUcvRzV4V2FLWHYxSHRSWkc3dHF2RjBaYnNDbXhwblFHbWZXZTJ4UkR2RXVjd0s2NTYrd0pLcGtQSUZpU05jQ1Jra3lxeExpWlU3bHJGV3hpREsvT3kxKy8rTHFkdGk0"

    });
// 备注 该方法应该在H5页面调用，h5应加装sdk1.3.2以上版本
    // wx.miniProgram.reLaunch({
    //   url: '/pages/minework/minework'
    // })
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
  // onShareAppMessage: function () {
  
  // }
})