// pages/flexwork/rewarddetail/rewarddetail.js
var dmNetwork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textLabel:'',
    detailList:[
      
    ]
  },

  getDetail(){
    this.setData({
      team_id: wx.getStorageSync('team_id'),
      project_id: wx.getStorageSync("project_id")
    })
    dmNetwork.post(dmNetwork.rewarddetail, {
      team_id: this.data.team_id,
      project_id: this.data.project_id
    },
      (res) => {
        if (res.data.errno == 0) {
          console.log(res.data.data.rule_list_desc)
          var detailList = []
          for (var i = 1; i < res.data.data.rule_list_desc.length;i ++){
            detailList.push(res.data.data.rule_list_desc[i])
          }
          this.setData({
            textLabel: res.data.data.rule_list_desc[0],
            detailList: detailList
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail()
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