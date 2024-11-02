// pages/uc/my_work/my_work.js
var dmNetwork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasData: true,
    workList: [],
    currentPage: 1,
    total_page: 1,
    isShowSendCodeView: false,
    getcodestatus: false,
    agingetcode: true,
    getcodetext: '获取验证码',
    msmcode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData()
    this.getMyWork();
  },
  initData: function () {
    this.setData({
      hasData: true,
      workList: [],
      currentPage: 1,
      total_page: 1
    })
  },
  getMyWork: function () {
    var that = this;
    dmNetwork.get(dmNetwork.get_mywork_list, {
      page: that.data.currentPage,
      dmclient: 'weixinxcx'
    }, (res) => {
      console.log(res)
      if (res.data.errno == 0) {
        var data = res.data.data
        if (data.length <= 0) {
          that.setData({
            hasData: false
          })
          return
        }
        var workList = data.list;
        if (workList.length !== 0) {
          var total_page = data.total_page
          var dataList = this.data.workList.concat(workList)
          that.setData({
            total_page,
            workList: dataList,
            hasData: true
          })
        } else {
          that.setData({
            hasData: false
          })
        }
      }
    })
  },
  goDetail: function (event) {
    var status = event.currentTarget.dataset.status + '';
    var project_id = event.currentTarget.dataset.projectid;
    console.log(event);
    if (status === '0') {
      wx.navigateTo({
        url: '/pages/uc/apply_quit/apply_quit?project_id=' + project_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/uc/feedback_page/feedback_page?project_id=' + project_id
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // debugger
    if (this.data.currentPage < this.data.total_page) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.getMyWork()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})