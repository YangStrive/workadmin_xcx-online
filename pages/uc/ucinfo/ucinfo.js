// pages/uc/ucinfo/ucinfo.js
var config = require('../../../config.js')
var dmNetwork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    logo_thumb_url:'',
    real_name_auth:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(typeof options.real_name_auth,99);
    var uc_info = wx.getStorageSync("uc_info");
    this.setData({
      name : uc_info.uc_name,
      logo_thumb_url: uc_info.uc_logo_thumb_url,
      real_name_auth: options.real_name_auth
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
    var uc_info = wx.getStorageSync("uc_info");
    this.setData({
      name: uc_info.uc_name,
      logo_thumb_url: uc_info.uc_logo_thumb_url
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
  
  },
  changeImage: function (e) { 
    var that = this
    wx.chooseImage({
      sizeType: ['compressed'],
      success: function (res) {
        dmNetwork.upload(res.tempFilePaths[0], 'uploadfile_ant', {},
          function (resData) {
            console.log("sssss");
            console.log(resData);
            wx.hideLoading()
            wx.showToast({
              title: '上传成功', 
              icon: 'none',
            });

            dmNetwork.post(dmNetwork.update_userinfo,
            {
              team_id: 0,
              project_id: 0,
              logo: resData[0].thumb_url
            },
            (res) => {
              if (res.data.errno == 0) {
                that.setData({
                  logo_thumb_url: resData[0].thumb_url
                })
                wx.setStorageSync("uc_info", {
                  "uc_logo_thumb_url": resData[0].thumb_url,
                  "uc_name": that.data.name,
                  "ned_refresh_page": "1"
                });
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
          },
          function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              icon: 'none',
            });
          })
      }
    })
    
  },
  changeName: function () {
    console.log(this.data.real_name_auth );
    if (this.data.real_name_auth === 'false') {
      wx.navigateTo({ url: "../changeName/changeName" })
    }
  }
})