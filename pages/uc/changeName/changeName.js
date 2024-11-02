// var config = require('../../../config.js')
var dmNetwork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'sssss',
    focus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uc_info = wx.getStorageSync("uc_info");
    this.setData({
      name: uc_info.uc_name,
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

  },

  inputName: function (e) {
    var str = e.detail.value
    console.log(str);
    this.setData({
      name: str
    })
  },

  cleanName: function () {
    this.setData({
      name: '',
      focus: true,
    })
  },

  saveAction: function () {
    if (this.data.name.length == 0) {
      wx.showToast({
        title: "姓名不能为空",
        icon: 'none'
      })
      return;
    }
    console.log(this.data.name);
    var that = this;
    dmNetwork.post(dmNetwork.update_userinfo,
      {
        team_id: 0,
        project_id: 0,
        real_name: this.data.name
      },
      (res) => {
        if (res.data.errno == 0) {
          console.log("成功");
          var uc_info = wx.getStorageSync("uc_info");
          wx.setStorageSync("uc_info", {
            "uc_logo_thumb_url": uc_info.uc_logo_thumb_url,
            "uc_name": that.data.name,
            "ned_refresh_page": "1"
          });
          wx.navigateBack({
            delta: '1'
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      (err) => {

      }
    )
  }

})