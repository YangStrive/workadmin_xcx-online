var dmNetwork = require('../../utils/network.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankName:'',
    cardNumber:'',
  },
  getBankInfo:function(){
    let that = this;
    dmNetwork.post(
      dmNetwork.getuserinfo, 
      {},
    (res) => {
      if (res.data.errno == 0) {
        that.setData({
          bankName:res.data.data.bank_info,
          cardNumber:res.data.data.bank_card_number,
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }

    }, (err) => {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    })
  },
  unlockBankCard:function(){
    wx.showModal({
      title: '',
      content: '是否确定要解绑该银行卡',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          dmNetwork.post(
            dmNetwork.unbindBankCard, 
            {},
          (res) => {
            if (res.data.errno == 0) {
              wx.showToast({
                title: '解绑成功',
                icon: 'none'
              })
              setTimeout(()=>{
                wx.switchTab({  
                  url:'../uc/account/account'  
                });  
              },1000)
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
      
          }, (err) => {
            wx.showToast({
              title: '网络连接失败',
              icon: 'none'
            })
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBankInfo()
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