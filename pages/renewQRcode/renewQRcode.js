// pages/renewQRcode/renewQRcode.js
var dmNetwork = require('../../utils/network.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorInfos: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var q = decodeURIComponent(query.q)
    // var q = 'https://saas-test.doumi.com/protocolRenewQRcode/code=TlhFVGtZbTBpcnBmVnV3R05NZTBuR21JVDcwTS9BbFE2Tnl2RjBaYnR5cTBzUQ==';
    // console.log('renewQRcode onload.....', q);
    var index = q.indexOf("code=");
    var renewQRcode = q.substr(index + 5);
    wx.setStorageSync("renewQRcode", renewQRcode);
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
    this.canRenewTheContract()
  },
  //用户续签状态检查
  canRenewTheContract() {
    const code = wx.getStorageSync("renewQRcode");
    if (!code) {
      return
    }
    dmNetwork.get(dmNetwork.canRenewTheContract, { code }, (res) => {
      this.setData({
        errorInfos: res.data
      })
    }, (err) => {
      //网络异常处理
      this.setData({
        errorInfos: err.data
      })
    })
  },
  goIndex: function () {
    console.log('go index page');
    wx.switchTab({ url: "/pages/index/index" });
  },
  confirmRenewTheContract() {
    const code = wx.getStorageSync("renewQRcode");
    if (!code) {
      wx.showToast({
        title: '签约异常，请重新扫码签约',
        icon: "none"
      })
      return
    }
    dmNetwork.get(dmNetwork.renewTheContract, { code }, (res) => {
      if (res.data.errno == 0) {
        // wx.showToast({
        //   title: '签约成功',
        //   icon: "none"
        // });
        wx.navigateTo({ url: `../uc/contract_signing_new/contract_signing_new?team_id=${res.data.data.team_id}&project_id=${res.data.data.project_id}` });
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        });
      }
    }, (err) => {
      //网络异常处理
      wx.showToast({
        title: '签约异常，请重新扫码签约',
        icon: "none"
      })
    })
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