// pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showActivePage:true,
    showpage:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  clRecommend:function(){
    wx.navigateToMiniProgram({
      appId:'wxb27f569abc5d69d3',
      path:'/pages/rmlist/rmlist?from=share5&uid=0'
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
    let showActivePage = wx.getStorageSync("showActivePage")
    if(showActivePage === 'hidden'){
      this.setData({
        showActivePage:false,
      })
    }else{
      this.setData({
        showActivePage:true,
      })

    }
    this.setData({
      showpage:true,
    })
    console.log(this.data.showpage,this.data.showActivePage)
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