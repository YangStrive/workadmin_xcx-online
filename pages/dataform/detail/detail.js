// detail.js
var team_id;
var project_id;
var attendance_id;
var time_id;
var task_id;
var schedule_id;
var form_data_id;

var cross;
var cross_attend;
var task_id_yesterday;
var mac_address;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_data: [],
    needChange: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var title = options.title
    if(''!=title){
      wx.setNavigationBarTitle({
        title: title,
      })
    }
    if (options.type == 1) {
      project_id = options.project_id
      team_id = options.team_id;
      task_id = options.task_id;
      form_data_id = options.form_data_id
      attendance_id = options.attendance_id;

      time_id = options.time_id
      schedule_id = options.schedule_id
      cross_attend = options.cross_attend
      cross = options.cross
      task_id_yesterday = options.task_id_yesterday
      mac_address = options.mac_address
      console.log(task_id_yesterday,11111)
      this.setData({
        needChange: true
      })
    } else {
      this.setData({
        needChange: false
      })
    }

    wx.getStorage({
      key: 'attendance_detail',
      success: function (res) {
        console.log(res.data,222)
        that.setData({
          form_data: res.data
        })
      },
    })
  },
  imgYu: function (evFent) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  resetAttdance: function (e) {
    console.log(task_id_yesterday)
    wx.navigateTo({
      url: '../../dataform/dataform?type=1&title=考勤信息填写&team_id=' + team_id + '&project_id=' + project_id + "&form_data_id=" + form_data_id +"&count=2" +'&attendance_id=' + attendance_id + '&time_id=' + time_id + '&task_id=' + task_id + "&schedule_id=" + schedule_id + "&cross=" + cross + "&cross_attend=" + cross_attend + "&task_id_yesterday=" + task_id_yesterday+"&mac_address=" +
      mac_address
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
})