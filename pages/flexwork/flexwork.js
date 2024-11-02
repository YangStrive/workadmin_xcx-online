// pages/flexwork/apply/apply.js
var dmNetwork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workList: [],
    min_id: 0,
    load_more: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  getWorkList() {
    dmNetwork.getInBackground(dmNetwork.flex_work_list, {
      team_id: this.data.team_id,
      project_id: this.data.project_id,
      page_size: 20,
      min_id: this.data.min_id
    }, (res) => {
      wx.stopPullDownRefresh();
      if (res.data.errno == 0) {
        var result = []
        var add = []
        if (this.data.min_id != 0) {
          add = this.data.workList
        }
        if (res.data.data.list.length > 0) {
          result = add.concat(res.data.data.list)
        }
        console.log(result)
        this.setData({
          min_id: res.data.data.page_data.min_id,
          load_more: res.data.data.page_data.load_more,
          workList: result,
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    }, (err) => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    })
  },
  clickItem(e) {
    var idx = e.currentTarget.dataset.idx
    console.log(e)
    wx.navigateTo({
      url: 'apply/apply?team_id=' + this.data.workList[idx].team_id + '&atask_id=' + this.data.workList[idx].autonomy_task_id + '&project_id=' + this.data.workList[idx].project_id + '&task_id=' + this.data.workList[idx].task_id + '&position_id=' + this.data.workList[idx].position_id + '&schedule_id=' + this.data.workList[idx].schedule_id + '&autonomy_publish_id=' + this.data.workList[idx].autonomy_publish_id + '&title=' + this.data.workList[idx].project_name
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
    var tid = wx.getStorageSync('team_id')
    var pid = wx.getStorageSync('project_id')
    var needRefresh = wx.getStorageSync('needRefreshFwork')

    if (tid != '' && pid != '' && needRefresh == 1) {

      wx.setStorageSync('needRefreshFwork', 0)
      this.setData({
        team_id: tid,
        project_id: pid,
        min_id: 0,
        load_more: 0,
        workList: []
      })

      this.getWorkList()
    }
  },
  onPullDownRefresh: function () {
    if (this.data.team_id == '' || this.data.project_id == '') {
      return
    }
    this.setData({
      min_id: 0,
      load_more: 0,
      // workList: []
    })

    this.getWorkList()
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.load_more != 0) {
      this.getWorkList()
    }

  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})

// pages/flexwork/flexwork.js