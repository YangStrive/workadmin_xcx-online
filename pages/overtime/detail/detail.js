// pages/overtime/detail/detail.js
var util = require('../../../utils/util.js')
var dmNetwork = require('../../../utils/network.js')
var collector = require('../../../utils/collector.js')
var currentWage = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Data: [{ id: 0, value: 30, title: '平时 1倍 30' }, { id: 0, value: 45.8, title: '周末 1.5倍 45.8' }, { id: 0, value: 60, title: '节假日 2倍 70.1' },],
    pageType: 1,
    selectIndex: 0,
    allDayMoney: 0,
    allHourMoney: 0,
    totalMoney: 0,
    selectHour: 0,
    hourMoney: 0,
    showMoney: 0,
    otherMoney: 0,
    selectHourH: 0,
    selectHourM: 0,
    note: '',
    day: 0,
    note: '',
    dayMoney: 0,
    overTime: 65,
    timeList: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5],
    weeks: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    const cur_date = date.getDay()

    var time = util.formatTimeDate(date)

    this.setData({
      selectTime: time,
      selectDate: util.formatTimeNew(date),
      cur_date: util.formatTimeNew(date),
      startTime: '2014-01-01',
      // endTime: util.formatTimeNew(date),
      endTime: util.formatTimeNew(date),
      hourMoney: 0
    })
    var ptype = options.ptype
    if (ptype == 2) {
      var note = options.note
      // var date = options.date
      var d = new Date();
      var date = util.formatTimeNew(d)
      var overtime = options.overtime
      var overtimePay = options.overtimePay
      var type = options.type
      var otherMoney = 0
      var alltimePay = options.alltimePay
      if (note == 'null'){
        note = ''
      }
      var dateStr = date.split('-')
      this.setData({
        selectTime: dateStr[0] + '年' + dateStr[1] + '月' + dateStr[2] + '日',
        cur_date: date,
        selectDate: date,
      })
      if (type == 1) {
        var sH = 0
        var sM = 0
        var sStr = overtime.split('.')
        sH = sStr[0]
        var sIndex = 0
        if (sStr[1] == 0) {
          sM = 0
        } else {
          sM = 30
        }
        for (var i = 0; i < this.data.timeList.length; i++) {
          if (overtime == this.data.timeList[i]) {
            sIndex = i
          }
        }

        this.setData({
          pageType: 1,
          selectHour: this.data.timeList[sIndex],
          selectHourH: sH,
          selectHourM: sM,
          selectIndex: sIndex,
          allHourMoney: 0,
          totalMoney: parseFloat(alltimePay) * overtime,
          otherMoney: parseFloat(otherMoney),
          hourMoney: parseFloat(alltimePay),
          showMoney: parseFloat(alltimePay) * overtime,
          // note:note
        })
      } else {
        this.setData({
          pageType:2,
          allDayMoney: parseFloat(alltimePay),
          showMoney: parseFloat(alltimePay),
          totalMoney: parseFloat(alltimePay),
          otherMoney: parseFloat(otherMoney),
          hourMoney: 0
          // note: note
        })
      }


    } else {
      this.setData({
        pageType: 2
        // note: note
      })
    }

  },
  changeType() {
    if (this.data.pageType == 1) {

      this.setData({
        pageType: 2,
        showMoney: this.data.allDayMoney,
        totalMoney: this.data.allDayMoney + this.data.otherMoney
      })
    } else {
      this.setData({
        pageType: 1,
        showMoney: this.data.allHourMoney,
        totalMoney: this.data.allHourMoney + this.data.otherMoney
      })
    }

  },
  cleanStr(value) {
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
    if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
      value = parseFloat(value);
    }
    return value
  },
  inputBaseWage: function (e) {

    var str = e.detail.value
    if (str.length > 0) {
      var money = this.cleanStr(str)
      var am = money * (this.data.selectHour * 10) / 10
      this.setData({
        allHourMoney: am,
        showMoney: am,
        hourMoney: money,
        totalMoney: am + this.data.otherMoney
      })
    } else {
      this.setData({
        allHourMoney: 0,
        hourMoney: 0,
        showMoney: 0,
        totalMoney: this.data.otherMoney
      })
    }
  },
  inputOtherWage: function (e) {

    var str = e.detail.value
    
    var aM = this.data.showMoney
    // if (this.data.pageType == 1){
    //   aM = this.data.showMoney * (10 * this.data.selectHour)/10
    // }
   console.log(aM,'cccc')
    if (str.length > 0) {
      var money = this.cleanStr(str)
      this.setData({
        otherMoney: money,
        totalMoney: aM + money
      })
    } else {
      this.setData({
        otherMoney: 0,
        totalMoney: aM
      })
    }
  },
  inputDay: function (e) {

    var str = e.detail.value
    if (str.length > 0) {
      var day = this.cleanStr(str)
      var am = day * (this.data.dayMoney * 10) / 10
      this.setData({
        allDayMoney: am,
        day: day,
        showMoney: am,
        totalMoney: am + this.data.otherMoney
      })
    } else {
      this.setData({
        allDayMoney: 0,
        day: 0,
        showMoney: 0,
        totalMoney: this.data.otherMoney
      })
    }
  },
  inputDayWage: function (e) {

    var str = e.detail.value
    if (str.length >= 0) {
      var money = this.cleanStr(str)
      var am = money
      this.setData({
        allDayMoney: money,
        dayMoney: money,
        showMoney: am,
        totalMoney: am + this.data.otherMoney
      })
    } else {
      this.setData({
        allDayMoney: 0,
        dayMoney: 0,
        showMoney: 0,
        totalMoney: this.data.otherMoney
      })
    }
  },
  bindDateChange: function (e) {
    var dateStr = e.detail.value.split('-')
    var selectDate = e.detail.value
    var va = (parseInt(dateStr[2]) - 1) % 7
    this.setData({
      selectTime: dateStr[0] + '年' + dateStr[1] + '月' + dateStr[2] + '日',
      cur_date: dateStr[0] + '-' + dateStr[1] + '-' + dateStr[2],
      selectDate: selectDate
    })
    this.getOvertimeList(e.detail.value, e.detail.value)

  },
  bindChange: function (e) {
    // currentWage = parseInt(e.detail.value)
    // this.setData({
    //   hourMoney: this.data.Data[currentWage].value,
    //   allMoney: (this.data.Data[currentWage].value*100) * this.data.selectHour/100
    // })
  },
  selectOverTime: function (e) {

    var hour = e.currentTarget.dataset.value
    console.log(hour)
    if (hour == -1) {
      return
    }
    var index = e.currentTarget.dataset.idx
    var sH = 0
    var sM = 0
    var sStr = ('' + hour).split('.')
    sH = sStr[0]
    if (sStr.length == 1) {
      sM = 0
    } else {
      sM = 30
    }
    var smoney =  (10 * hour * this.data.hourMoney)/10
    if (this.data.pageType == 2) {
      smoney = this.data.allDayMoney
    }
    this.setData({
      selectIndex: index,
      selectHour: hour,
      selectHourH: sH,
      selectHourM: sM,
      showMoney:smoney,
      allHourMoney: (10 * this.data.hourMoney * hour) / 10,
      totalMoney: ((10 * this.data.hourMoney * hour) / 10) + this.data.otherMoney
    })
  },
  textareaChange: function (e) {
    this.setData({
      note: e.detail.value
    })
  },
  saveWage: function (e) {
    console.log(22222222);
    console.log(e);
    collector.saveFormid(e.detail.formId)
    collector.uploadFormid()

    var otime = this.data.timeList[this.data.selectIndex]
    var money = this.data.hourMoney
    if (this.data.pageType == 2) {
      money = this.data.allDayMoney
      otime = 1
    }
    // if (0 == money) {
    //   wx.showToast({
    //     title: '请输入工资',
    //     icon: 'none'
    //   })
    //   return
    // }
    // if (this.data.pageType == 1 && this.data.timeList[this.data.selectIndex] == 0) {
    //   wx.showToast({
    //     title: '请选择加班时间',
    //     icon: 'none'
    //   })
    //   return
    // }

    var postData = {
      note: this.data.note,
      allMoney: money,
      otherMoney: this.data.otherMoney,
      totalMoney: this.data.totalMoney,
      overtime: otime,
      type: this.data.pageType,
      date: this.data.selectDate
    }


    wx.setStorageSync('local_overtime', JSON.stringify(postData))                        

    dmNetwork.post(dmNetwork.overtime_add, postData,
      (res) => {
        console.log(res)
        if (res.data.errno == 0) {
          wx.setStorageSync('needOverTimeRefresh', 1)
          wx.navigateBack({
            delta: '1'
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }

      }, (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      })

  },

  getOvertimeList(start, end) {
    dmNetwork.get(dmNetwork.overtime_list, {
      start_date: start,
      end_date: end
    }, (res) => {

      if (res.data.errno == 0 && res.data.data.overWorkList.length > 0) {

        if (res.data.data.overWorkList[0].type == 1) {
          var sH = 0
          var sM = 0
          var sStr = res.data.data.overWorkList[0].overtime.split('.')
          sH = sStr[0]
          var sIndex = 0
          if (sStr[1] == 0) {
            sM = 0
          } else {
            sM = 30
          }
          for (var i = 0; i < this.data.timeList.length; i++) {
            if (res.data.data.overWorkList[0].overtime == this.data.timeList[i]) {
              sIndex = i
            }
          }

          this.setData({
            pageType: 1,
            selectHour: this.data.timeList[sIndex],
            selectHourH: sH,
            selectHourM: sM,
            selectIndex: sIndex,
            allHourMoney: 0,
            startTime: '2014-01-01',
            totalMoney: parseFloat(res.data.data.overWorkList[0].overtimePay),
            otherMoney: parseFloat(res.data.data.overWorkList[0].otherMoney),
            hourMoney: parseFloat(res.data.data.overWorkList[0].alltimePay),
            showMoney: parseFloat(res.data.data.overWorkList[0].alltimePay),
            note: res.data.data.overWorkList[0].note
          })
        } else {
          this.setData({
            pageType: 2,
            startTime: '2014-01-01',
            allDayMoney: parseFloat(res.data.data.overWorkList[0].alltimePay),
            showMoney: parseFloat(res.data.data.overWorkList[0].alltimePay),
            totalMoney: parseFloat(res.data.data.overWorkList[0].overtimePay),
            otherMoney: parseFloat(res.data.data.overWorkList[0].otherMoney),
            note: res.data.data.overWorkList[0].note
          })
        }
      }

    }, (err) => {

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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})
