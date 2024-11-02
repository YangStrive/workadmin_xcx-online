var dmNetwork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceID_token: "",
    from: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('itionssss', options)
    this.from = options.from;
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
    this.geFaceToken().then(res => {
      console.log('tkenenen', res);
      let auth_url = res.auth_url;
      this.setData({
        faceID_token: auth_url
      })
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: "none",
      });
    });
  },
  //获取个人token
  geFaceToken: function () {
    const that = this
    return new Promise((reslove, reject) => {
      let data = this.from ? { from: this.from } : {}
      dmNetwork.get(dmNetwork.geFaceToken, data, (res) => {
        console.log("获取个人token", res)
        if (res.data.errno == 0) {
          let data = res.data.data;
          reslove(data);
        } else {
          reject(res.data.errmsg);
        }
      }, (err) => {
        //网络异常处理
        reject(err);
      })
    })
  },
  setMessage (e) {
    if (this.from) {
      wx.setStorageSync('biz_id_wage', e.detail.data)
    } else {
      wx.setStorageSync('biz_id', e.detail.data)
    }
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