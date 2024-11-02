// pages/we2000/we2000.js
var dmNetwork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberId: ''
  },
  getMemberId() {
    dmNetwork.get(dmNetwork.check_we, {
      dmclient: 'weixinxcx',
      project_id: 0
    }, (res) => {
      if (res.data.errno == 0) {
        let memberId = res.data.data.user_id.slice(10)
        that.setData({
          memberId: memberId
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        })
      }
    })
  },
  // 跳转到we2000
  goWe() {
    let that = this
    dmNetwork.get(dmNetwork.record_we, {
      dmclient: 'weixinxcx'
    }, res => {
      if (res) {
        wx.navigateToMiniProgram({
          appId: 'wxcb823d713276a10d',
          path: 'page/landing/landing?jumpPage=merchant-introv2&jumpType=2',
          extraData: {
            webankAppId: 'W9847561',
            memberId: that.data.memberId,
            secondid: '',
            thirdid: '',
            channel_ext_info: ''
          },
          envVersion: 'release'
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMemberId()
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