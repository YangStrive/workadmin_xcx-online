// reportlist.js
var util = require('../../../utils/util.js')
var dmNetwork = require('../../../utils/network.js')

var team_id;
var project_id;
var current_page;
var nick_name;
var currentData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    sign_data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTimeDate(new Date())
    current_page = 1;
    this.setData({
      selectTime: time
    })
    team_id = options.team_id
    project_id = options.project_id
    currentData = util.formatTimeDate2(new Date())
    this.getDataFormServer(team_id, project_id, util.formatTimeDate2(new Date()), current_page)
  },
  getDataFormServer: function (team_id, project_id, date, page){
    var rData = {
      team_id: team_id,
      project_id: project_id,
      date: date,
      page_no: page,
      page_size: 20
    }

    dmNetwork.get(dmNetwork.positionList, rData, (res) => {
      if (current_page > 1 && result.sign_data.length == 0){
        return
      }
      var result = res.data.data;

      nick_name = result.nick_name
      var hasData = false;
      if (result.sign_data.length > 0) {
        hasData = true
      } else {
        hasData = false
      }
      var resultList = this.data.sign_data
      for (var i = 0; i < result.sign_data.length; i++) {
        result.sign_data[i].hasImage = false
        for (var j = 0; j < result.sign_data[i].form_data.length; j++) {
          console.log(result.sign_data[i].form_data[j])
          if (result.sign_data[i].form_data[j].type == 'Imageview' && result.sign_data[i].form_data[j].value.url.length>0) {
            result.sign_data[i].hasImage = true
            //取第一张
            result.sign_data[i].image = result.sign_data[i].form_data[j].value.url[0]
          }
          console.log(result.sign_data[i].form_data[j].type,j,"iiiii")
          if (result.sign_data[i].form_data[j].type == 'Location') {
            result.sign_data[i].lvalue = result.sign_data[i].form_data[j].value
          }
          
        }
        resultList.push(result.sign_data[i])
      }
      console.log(resultList,222222)
      
      
      this.setData({
        count: result.sign_amount,
        require_field: result.require_field,
        sign_data: resultList
      })

    }, (err) => {
      //网络异常处理
    })
  }
  ,
  bindDateChange: function (e) {
    current_page = 1;
    var dateStr = e.detail.value.split('-')
    currentData = e.detail.value
    this.data.sign_data = []
    this.getDataFormServer(team_id, project_id, e.detail.value , current_page)
    this.setData({
      selectTime: dateStr[0] + '年' + dateStr[1] + '月' + dateStr[2] + '日'
    })
  },
  clickItem(e){
    var data = e.currentTarget.dataset.detail;
    wx.setStorage({
      key: 'sign_data',
      data: data,
    })
    wx.navigateTo({
      url: '../reportdetail/reportdetail?nick_name=' + nick_name,
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
    current_page ++
    this.getDataFormServer(team_id, project_id, currentData, current_page)
  }
})