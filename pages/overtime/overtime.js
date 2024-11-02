// pages/overtime/overtime.js
var dmNetwork = require('../../utils/network.js')
var collector = require('../../utils/collector.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    overtimeList: [],
    overtimePayTotal: 0,
    overtimeTotal: 0,
    weeks: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    addType: [{ title: '按小时', atype: 1 }, { title: '按天', atype: 1 }]
  },
  touch_start: "",
  touch_end: "",

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    this.setData({
      cur_year,  //年
      cur_month
    })
    // date.setMonth(date.getMonth() + 9);
    // console.log(date.getMonth()+1)
    var start = cur_year + '-' + cur_month + '-' + 1

    var end = cur_year + '-' + cur_month + '-' + this.getThisMonthDays(cur_year, cur_month)
    this.getOvertimeList(start, end)
  },
  hideTip() {
    this.setData({
      isNeedShowOvertimeTip: false
    })
  },
  getOvertimeList(start, end) {
    dmNetwork.get(dmNetwork.overtime_list, {
      start_date: start,
      end_date: end
    }, (res) => {

      if (res.data.errno == 0) {
        if (wx.getStorageSync('isNeedShowOvertimeTip') == '' && res.data.data.overWorkList.length == 1) {
          this.setData({
            isNeedShowOvertimeTip: true
          })
          wx.setStorageSync('isNeedShowOvertimeTip', 1)
        }
        for (var i = 0; i < res.data.data.overWorkList.length; i++) {
          var dateStr = res.data.data.overWorkList[i].date.split('-')
          var day = new Date(res.data.data.overWorkList[i].date).getDay()
          res.data.data.overWorkList[i].week = this.data.weeks[day]
        }
        this.setData({
          overtimeList: res.data.data.overWorkList,
          overtimePayTotal: res.data.data.overtimePayTotal,
          overtimeTotal: res.data.data.overWorkList.length
        })
        wx.setStorageSync('overtimeList', res.data.data.overWorkList)
      }

    }, (err) => {

    })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();   //返回一个月总天数 
  },
  clickItem: function (e) {

    var index = e.currentTarget.dataset.idx
    let that = this;

    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;

    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除' + that.data.overtimeList[index].date + '这天的工时记录',
        success: function (res) {
          if (res.confirm) {

            dmNetwork.get(dmNetwork.overtime_delete, {
              date: that.data.overtimeList[index].date
            }, (res) => {
              if (res.data.errno == 0) {
                var start = that.data.cur_year + '-' + that.data.cur_month + '-' + 1

                var end = that.data.cur_year + '-' + that.data.cur_month + '-' + that.getThisMonthDays(that.data.cur_year, that.data.cur_month)
                that.getOvertimeList(start, end)
              }
            }, (error) => {

            })
          }
        }
      })
    } else {

      wx.navigateTo({
        url: 'detail/detail?date=' + this.data.overtimeList[index].date + '&note=' + this.data.overtimeList[index].note + '&overtime=' + this.data.overtimeList[index].overtime + '&overtimePay=' + this.data.overtimeList[index].overtimePay + '&type=' + this.data.overtimeList[index].type + '&ptype=' + 2 + '&otherMoney=' + this.data.overtimeList[index].otherMoney + '&alltimePay=' + this.data.overtimeList[index].alltimePay,
      })
    }
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;  //得到 data-handle 值
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;

    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      var start = newYear + '-' + newMonth + '-' + 1

      var end = newYear + '-' + newMonth + '-' + this.getThisMonthDays(newYear, newMonth)
      this.getOvertimeList(start, end)
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      var endM = new Date().getMonth() + 1

      // if (newMonth > endM) {
      //   return
      // }
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      var start = newYear + '-' + newMonth + '-' + 1
      var end = newYear + '-' + newMonth + '-' + this.getThisMonthDays(newYear, newMonth)
      this.getOvertimeList(start, end)
    }

  },
  bindTypeChange: function (e) {

    console.log('aaa111');
    console.log(e);
    collector.saveFormid(e.detail.formId)
    collector.uploadFormid()

    var local_overtime = wx.getStorageSync('local_overtime')
    if (local_overtime != undefined && local_overtime != '') {
      var local_overtime_data = JSON.parse(local_overtime)
     
      wx.navigateTo({
        url: 'detail/detail?date=' + local_overtime_data.date + '&note=' + local_overtime_data.note + '&overtime=' + local_overtime_data.overtime + '&overtimePay=' + local_overtime_data.totalMoney + '&type=' + local_overtime_data.type + '&ptype=' + 2 + '&otherMoney=' + local_overtime_data.otherMoney + '&alltimePay=' + local_overtime_data.allMoney,
      })
    } else {
      wx.navigateTo({
        url: 'detail/detail?ptype=' + 1
      })
    }


  },
  settingWage: function (e) {
    wx.navigateTo({
      url: 'setting/setting',
    })
  },
  overtimetouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  overtimetouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
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

    var needRefresh = wx.getStorageSync("needOverTimeRefresh")

    if (needRefresh != 0) {
      wx.setStorageSync('needOverTimeRefresh', 0)
      var start = this.data.cur_year + '-' + this.data.cur_month + '-' + 1

      var end = this.data.cur_year + '-' + this.data.cur_month + '-' + this.getThisMonthDays(this.data.cur_year, this.data.cur_month)
      this.getOvertimeList(start, end)
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