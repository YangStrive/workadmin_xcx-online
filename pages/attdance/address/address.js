// pages/attdance/address/address.js
var dmNetwork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    lat: 23.099994,
    log: 113.324520
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var team_id = options.team_id
    var project_id = options.project_id
    var attendance_id = options.attendance_id
    var task_id = options.task_id
    var date = options.date

    var lat = options.lat
    var lng = options.lng
    console.log(attendance_id)
    if (attendance_id == 'undefined'){
      var vMarks = {}
      vMarks.iconPath = '/image/ic_attendance_address_select.png'
      vMarks.latitude = lat
      vMarks.longitude = lng
      vMarks.width = 92
      vMarks.height = 84
      vMarks.id = 1;

      this.setData({
        markers: [vMarks],
        lat: lat,
        log: lng
      })
      return
    }
    dmNetwork.get(dmNetwork.attendance_position,{
      team_id: team_id,
      project_id: project_id,
      attendance_id: attendance_id,
      task_id: task_id,
      date: date
    },
    (res)=>{
      var resultMarkers = []
      var attMarke = {}
      var coordinate = res.data.data.attend_position.coordinate
      var ls = coordinate.split(',')
      /*iconPath: "/image/ic_mine_job_location.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 30,
      height: 35,*/

      attMarke.iconPath = '/image/ic_attendance_address_check.png'
      attMarke.latitude = ls[1]
      attMarke.longitude = ls[0]
      attMarke.width = 86
      attMarke.height = 71
      attMarke.id = 0;
      resultMarkers.push(attMarke)
      for (var i = 0; i < res.data.data.task_position.length;i++){
        var coordinate = res.data.data.task_position[i].coordinate
        var tls = coordinate.split(',')
        var tMarks = {}
        tMarks.iconPath = '/image/ic_attendance_address_select.png'
        tMarks.latitude = tls[1]
        tMarks.longitude = tls[0]
        tMarks.width = 92
        tMarks.height = 84
        tMarks.id = i+1;
        resultMarkers.push(tMarks)
      }
      this.setData({
        markers: resultMarkers,
        lat: ls[1],
        log: ls[0]
      })
    },
    (err)=>{

    })
  },
  markertap:function(){

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