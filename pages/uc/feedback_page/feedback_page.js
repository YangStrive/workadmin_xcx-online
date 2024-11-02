// pages/uc/feedback_page/feedback_page.js
var dmNetwork = require('../../../utils/network.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    project_id: '',
    status: '', //状态 1.待确认 2.已批准 3.已拒绝
    title: '',
    audit_refuse_reason: '', //拒绝原因
    plan_leave_date: '', //计划离职日期
    leave_reason: '', //离职原因
    salary_end_date: '', //止薪日
    leave_date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
    this.getStatus();
  },
  initData: function (options) {
    var project_id = options.project_id
    this.setData({
      project_id
    });
  },
  getStatus: function () {
    var that = this;
    dmNetwork.get(dmNetwork.get_mystatus_info, {
      project_id: that.data.project_id,
      dmclient: 'weixinxcx'
    }, (res2) => {
      console.log(res2)
      if (res2.data.errno == 0) {
        var data2 = res2.data.data;
        var arr = {
          '1': '提交成功',
          '2': '已批准',
          '3': '已拒绝'
        }
        var title = '离职申请' + arr[data2.status]
        this.setData({
          title,
          status: data2.status,
          audit_refuse_reason: data2.audit_refuse_reason?data2.audit_refuse_reason:'',
          plan_leave_date: data2.plan_leave_date?data2.plan_leave_date:'',
          leave_reason: data2.leave_reason?data2.leave_reason:'',
          salary_end_date: data2.salary_end_date?data2.salary_end_date:'',
          leave_date:data2.leave_date?data2.leave_date:''
        })
      }
    })
  },
  restartSubmit: function () {
    wx.redirectTo({
      url: '/pages/uc/apply_quit/apply_quit?project_id=' + this.data.project_id
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

  }
})