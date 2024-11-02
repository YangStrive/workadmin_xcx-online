// pages/withdrawal/bindwxpay/bing'd'w'x'pay.js

var dmNetwork = require('../../../utils/network.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxnickname: '',
    true_name: '',
    showMask: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.true_name);
    this.setData({
      true_name: options.true_name
    })
  },
  initAjax: function (ev) {
    if (ev.detail.e && ev.detail.e.nickName) {
      this.setData({ showMask: false, wxnickname: ev.detail.e.nickName })
    } else {
      wx.showToast({ title: '获取用户信息失败', icon: 'none' })
    }
  },
  imagetap: function () {
    wx.showModal({
      title: '申明',
      showCancel: false,
      content: '为了确保账户和资金的安全，同时遵循国家相关实名法规规定，账户一经实名认证通过，提现的账户信息就必须与账户信息完全一致才能互相绑定',
      success: function (res) {

      }
    })
  },

  bindwx: function () {
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          dmNetwork.post(dmNetwork.bindwx, { account_type: 2, nic_name: that.data.wxnickname,name:that.data.true_name, code: res.code }, (res) => {
            if (res.data.errno == 0) {
              wx.showToast({ title: '绑定成功', icon: 'success' })
              setTimeout(function () {
                wx.redirectTo({ url: '../withdrawal/withdrawal' })
              }, 1500)
            }
            else {
              wx.showToast({ title: res.data.errmsg, icon: 'none' })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function () {
        wx.showToast({ title: '获取用户信息失败', icon: 'none' })
      }
    });
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